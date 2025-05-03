import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../../context/ThemeContext"
import { useFarmStore, type RiskAlert } from "../../store/farmStore"
import { useUserStore } from "../../store/userStore"
import { Calendar, CheckCircle, Share2, AlertTriangle, AlertCircle, LogOut } from "react-native-feather"
import Cloud from "../../components/Cloud"
import { useState } from "react"
import { Typography } from "../../components/Typography"
import { Card } from "../../components/Card"

export default function PlanningScreen() {
  const { colors, radius } = useTheme()
  const { recommendedCrops, actionItems, riskAlerts } = useFarmStore()
  const { logoutUser } = useUserStore()
  const [activeTab, setActiveTab] = useState<'planning'|'risks'>('planning')

  // Sort crops by planting date
  const sortedCrops = [...recommendedCrops].sort(
    (a, b) => new Date(a.plantingDate).getTime() - new Date(b.plantingDate).getTime(),
  )

  // Group action items by priority
  const groupedActionItems = {
    high: actionItems.filter((item) => item.priority === "high"),
    medium: actionItems.filter((item) => item.priority === "medium"),
    low: actionItems.filter((item) => item.priority === "low"),
  }

  const getRiskIcon = (type: "pest" | "disease" | "weather") => {
    switch (type) {
      case "pest":
        return <AlertTriangle width={20} height={20} stroke="#F59E0B" />
      case "disease":
        return <AlertCircle width={20} height={20} stroke="#EF4444" />
      case "weather":
        return <Cloud width={20} height={20} stroke="#3B82F6" />
      default:
        return <AlertTriangle width={20} height={20} stroke="#F59E0B" />
    }
  }

  const getSeverityColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return "#10B981"
      case "medium":
        return "#F59E0B"
      case "high":
        return "#EF4444"
      default:
        return "#10B981"
    }
  }

  const renderRiskItem = ({ item }: { item: RiskAlert }) => (
    <TouchableOpacity
      style={[
        styles.riskCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderLeftColor: getSeverityColor(item.severity),
        },
      ]}
    >
      <View style={styles.riskHeader}>
        <View style={styles.riskTypeContainer}>
          {getRiskIcon(item.type)}
          <Text style={[styles.riskType, { color: colors.text }]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>

        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
          <Text style={styles.severityText}>{item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}</Text>
        </View>
      </View>

      <Text style={[styles.riskDescription, { color: colors.text }]}>{item.description}</Text>

      <View style={styles.riskFooter}>
        <View style={styles.dateContainer}>
          <Calendar width={16} height={16} stroke={colors.text} />
          <Text style={[styles.dateText, { color: colors.text }]}>
            {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </Text>
        </View>

        <View style={styles.affectedCropsContainer}>
          <Text style={[styles.affectedCropsLabel, { color: colors.text }]}>Affected:</Text>
          <Text style={[styles.affectedCrops, { color: colors.text }]}>{item.affectedCrops.join(", ")}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tab navigation */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {activeTab === 'planning' ? 'Planning' : 'Risk Alerts'}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={logoutUser}
            style={[styles.logoutButton, { backgroundColor: colors.error + '15' }]}
          >
            <LogOut width={20} height={20} stroke={colors.error} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.exportButton, { backgroundColor: colors.primary }]}>
            <Share2 width={16} height={16} stroke="white" />
            <Text style={styles.exportText}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: colors.backgroundSecondary, borderRadius: radius.lg }]}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'planning' && { backgroundColor: colors.primary, borderRadius: radius.lg }
          ]}
          onPress={() => setActiveTab('planning')}
        >
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'planning' ? 'white' : colors.textSecondary }
          ]}>
            Planning
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'risks' && { backgroundColor: colors.primary, borderRadius: radius.lg }
          ]}
          onPress={() => setActiveTab('risks')}
        >
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'risks' ? 'white' : colors.textSecondary }
          ]}>
            Risks
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'planning' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Planting Timeline</Text>

            <View style={[styles.timelineCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {sortedCrops.map((crop, index) => (
                <View key={crop.id} style={styles.timelineItem}>
                  <View style={styles.timelineDateContainer}>
                    <Calendar width={16} height={16} stroke={colors.text} />
                    <Text style={[styles.timelineDate, { color: colors.text }]}>
                      {new Date(crop.plantingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.timelineConnector,
                      { backgroundColor: colors.border },
                      index === sortedCrops.length - 1 && { display: "none" },
                    ]}
                  />

                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text style={styles.timelineIcon}>{crop.icon}</Text>
                      <Text style={[styles.timelineCropName, { color: colors.text }]}>{crop.name}</Text>
                    </View>

                    <Text style={[styles.timelineHarvestDate, { color: colors.text }]}>
                      Harvest:{" "}
                      {new Date(crop.harvestDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Action Items</Text>

            {Object.entries(groupedActionItems).map(
              ([priority, items]) =>
                items.length > 0 && (
                  <View key={priority} style={styles.priorityGroup}>
                    <Text
                      style={[
                        styles.priorityLabel,
                        {
                          color: priority === "high" ? "#EF4444" : priority === "medium" ? "#F59E0B" : "#10B981",
                        },
                      ]}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                    </Text>

                    {items.map((item) => (
                      <View
                        key={item.id}
                        style={[
                          styles.actionItem,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            borderLeftColor:
                              priority === "high" ? "#EF4444" : priority === "medium" ? "#F59E0B" : "#10B981",
                          },
                        ]}
                      >
                        <View style={styles.actionItemHeader}>
                          <Text style={[styles.actionItemTitle, { color: colors.text }]}>{item.title}</Text>
                          <TouchableOpacity
                            style={[
                              styles.completeButton,
                              {
                                backgroundColor: item.completed ? "#10B981" : "transparent",
                                borderColor: item.completed ? "#10B981" : colors.border,
                              },
                            ]}
                          >
                            <CheckCircle
                              width={16}
                              height={16}
                              stroke={item.completed ? "white" : colors.text}
                              fill={item.completed ? "#10B981" : "transparent"}
                            />
                          </TouchableOpacity>
                        </View>

                        <Text style={[styles.actionItemDescription, { color: colors.text }]}>{item.description}</Text>

                        <View style={styles.actionItemFooter}>
                          <View style={styles.dueDateContainer}>
                            <Calendar width={14} height={14} stroke={colors.text} />
                            <Text style={[styles.dueDateText, { color: colors.text }]}>
                              Due:{" "}
                              {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ),
            )}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={riskAlerts}
          renderItem={renderRiskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    height: 48,
    padding: 4,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '600',
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  timelineCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
  },
  timelineDate: {
    marginLeft: 4,
    fontSize: 14,
  },
  timelineConnector: {
    width: 2,
    height: "100%",
    marginHorizontal: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  timelineIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  timelineCropName: {
    fontSize: 16,
    fontWeight: "600",
  },
  timelineHarvestDate: {
    fontSize: 14,
    opacity: 0.8,
  },
  priorityGroup: {
    marginBottom: 16,
  },
  priorityLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  actionItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  actionItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  actionItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  completeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  actionItemDescription: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.8,
  },
  actionItemFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueDateText: {
    marginLeft: 6,
    fontSize: 14,
  },
  // Risk styles
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  riskCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  riskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  riskTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  riskType: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  severityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  riskDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  riskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
  },
  affectedCropsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  affectedCropsLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  affectedCrops: {
    fontSize: 14,
  },
})
