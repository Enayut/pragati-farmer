import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { Typography } from '../Typography'
import { Card } from '../Card'
import { FileText, Check, X, AlertCircle, Filter } from 'react-native-feather'
import { useUserStore } from '../../store/userStore'

type Contract = {
  $id: string
  template_type: string
  locations: string[]
  dynamic_fields: string
  buyer_id: string
  status: string
  $createdAt: string
}

type ContractRequest = {
  $id: string
  contract_id: string
  farmer_id: string
  status: string
  $createdAt: string
}

const MarketContracts = () => {
  const { colors, spacing, radius } = useTheme()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [requests, setRequests] = useState<ContractRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('available')
  const user = useUserStore(state => state.user)
  const userEmail = user?.email
  const API_BASE_URL = 'https://0c35-124-66-175-40.ngrok-free.app'

  // Fetch available contracts and farmer's requests
  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        // Fetch actual contracts from API
        const contractsResponse = await fetch(`${API_BASE_URL}/contracts?email=${userEmail}`)
        const contractsData = await contractsResponse.json()
        
        // Fetch actual contract requests from API
        const requestsResponse = await fetch(`${API_BASE_URL}/contract_requests?email=${userEmail}`)
        const requestsData = await requestsResponse.json()
        
        setContracts(contractsData.documents || [])
        setRequests(requestsData.documents || [])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching contracts data:', error)
        setLoading(false)
        Alert.alert('Error', 'Failed to load contracts. Please check your connection and try again.')
      }
    }
    
    fetchData()
  }, [userEmail])
  
  const handleRequestContract = async (contractId: string) => {
    if (!userEmail) {
      Alert.alert('Error', 'You must be logged in to request a contract');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contract_requests?email=${userEmail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract_id: contractId })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit contract request')
      }
      
      const data = await response.json()
      
      setRequests([...requests, data])
      Alert.alert('Success', 'Contract request submitted successfully')
    } catch (error) {
      console.error('Error requesting contract:', error)
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to submit contract request')
    }
  }
  
  const handleDeleteRequest = async (requestId: string) => {
    if (!userEmail) {
      Alert.alert('Error', 'You must be logged in to manage requests');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contract_requests/${requestId}?email=${userEmail}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to withdraw request')
      }
      
      // Update local state
      setRequests(requests.filter(req => req.$id !== requestId))
      Alert.alert('Success', 'Request withdrawn successfully')
    } catch (error) {
      console.error('Error deleting request:', error)
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to withdraw request')
    }
  }
  
  const handleFulfillContract = async (requestId: string) => {
    if (!userEmail) {
      Alert.alert('Error', 'You must be logged in to fulfill contracts');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contract_requests/${requestId}/fulfill?email=${userEmail}`, {
        method: 'PATCH'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to mark contract as fulfilled')
      }
      
      const data = await response.json()
      
      // Update local state with the response data
      setRequests(requests.map(req => 
        req.$id === requestId ? data : req
      ))
      
      Alert.alert('Success', 'Contract marked as fulfilled')
    } catch (error) {
      console.error('Error fulfilling contract:', error)
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to mark contract as fulfilled')
    }
  }
  
  const renderDynamicFields = (fieldsJson: string) => {
    try {
      const fields = JSON.parse(fieldsJson || '{}');
      return Object.entries(fields).map(([key, value]) => {
        // Ensure key is a string and handle capitalization safely
        const formattedKey = (key || '')
          .split('_')
          .filter(Boolean) // Remove empty segments
          .map(word => {
            if (!word) return '';
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          })
          .join(' ');
        
        return (
          <View key={key || Math.random().toString()} style={styles.fieldRow}>
            <Typography variant="body" style={styles.fieldLabel}>
              {formattedKey || 'Field'}:
            </Typography>
            <Typography variant="body">{value !== undefined ? String(value) : ''}</Typography>
          </View>
        );
      });
    } catch (e) {
      console.error('Error parsing contract details:', e);
      return <Typography variant="body" color="error">Invalid contract details</Typography>;
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'listed':
      case 'accepted':
        return colors.success
      case 'pending':
        return colors.warning
      case 'fulfilled':
        return colors.primary
      default:
        return colors.error
    }
  }
  
  const renderContract = ({ item }: { item: Contract }) => (
    <Card variant="elevated" style={styles.contractCard}>
      <View style={styles.contractHeader}>
        <View style={styles.contractTypeContainer}>
          <FileText width={20} height={20} stroke={colors.primary} />
          <Typography variant="bodyLarge" style={styles.contractTitle}>
            {(item.template_type ? item.template_type.charAt(0).toUpperCase() : "") + (item.template_type ? item.template_type.slice(1) : "")} Contract
          </Typography>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Typography variant="small" color={getStatusColor(item.status) === colors.primary ? 'primary' : undefined} style={{ color: getStatusColor(item.status) }}>
            {item.status}
          </Typography>
        </View>
      </View>
      
      <View style={styles.locations}>
        <Typography variant="caption" color="textSecondary">Available in:</Typography>
        <Typography variant="body" style={{ marginLeft: 5 }}>{item.locations.join(', ')}</Typography>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.contractDetails}>
        {renderDynamicFields(item.dynamic_fields)}
      </View>
      
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={() => handleRequestContract(item.$id)}
      >
        <Typography variant="body" style={{ color: 'white', fontWeight: '600' }}>Request Contract</Typography>
      </TouchableOpacity>
    </Card>
  )
  
  const renderRequest = ({ item }: { item: ContractRequest }) => (
    <Card variant="elevated" style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.requestIdContainer}>
          <FileText width={16} height={16} stroke={colors.primary} />
          <Typography variant="body" style={styles.requestId}>Request #{item.$id.slice(0, 6)}</Typography>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Typography variant="small" style={{ color: getStatusColor(item.status) }}>
            {item.status}
          </Typography>
        </View>
      </View>
      
      <Typography variant="caption" color="textSecondary" style={styles.requestDate}>
        Requested on: {new Date(item.$createdAt).toLocaleDateString()}
      </Typography>
      
      <View style={styles.requestActions}>
        {item.status === 'pending' && (
          <TouchableOpacity 
            style={[styles.requestActionButton, { backgroundColor: colors.error + '20' }]}
            onPress={() => handleDeleteRequest(item.$id)}
          >
            <X width={16} height={16} stroke={colors.error} />
            <Typography variant="small" style={{ color: colors.error, marginLeft: 6 }}>
              Withdraw
            </Typography>
          </TouchableOpacity>
        )}
        
        {item.status === 'accepted' && (
          <TouchableOpacity 
            style={[styles.requestActionButton, { backgroundColor: colors.primary + '20' }]}
            onPress={() => handleFulfillContract(item.$id)}
          >
            <Check width={16} height={16} stroke={colors.primary} />
            <Typography variant="small" color="primary" style={{ marginLeft: 6 }}>
              Mark as Fulfilled
            </Typography>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  )

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'available' && [styles.activeTab, { borderBottomColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('available')}
        >
          <Typography 
            variant="body" 
            color={activeTab === 'available' ? 'primary' : 'textSecondary'}
          >
            Available Contracts
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'requests' && [styles.activeTab, { borderBottomColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('requests')}
        >
          <Typography 
            variant="body" 
            color={activeTab === 'requests' ? 'primary' : 'textSecondary'}
          >
            My Requests
          </Typography>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <Typography variant="body" style={styles.loadingText}>Loading...</Typography>
      ) : (
        activeTab === 'available' ? (
          <FlatList
            data={contracts}
            renderItem={renderContract}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <AlertCircle width={24} height={24} stroke={colors.textSecondary} />
                <Typography variant="body" color="textSecondary" style={styles.emptyText}>
                  No contracts available for your location
                </Typography>
              </View>
            }
          />
        ) : (
          <FlatList
            data={requests}
            renderItem={renderRequest}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <AlertCircle width={24} height={24} stroke={colors.textSecondary} />
                <Typography variant="body" color="textSecondary" style={styles.emptyText}>
                  You haven't requested any contracts yet
                </Typography>
              </View>
            }
          />
        )
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
  },
  listContainer: {
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    textAlign: 'center',
  },
  contractCard: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contractTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contractTitle: {
    fontWeight: '700',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  locations: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 14,
  },
  contractDetails: {
    marginBottom: 18,
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  fieldLabel: {
    fontWeight: '600',
    marginRight: 8,
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestId: {
    fontWeight: '600',
    marginLeft: 8,
  },
  requestDate: {
    marginBottom: 14,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  requestActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
})

export default MarketContracts
