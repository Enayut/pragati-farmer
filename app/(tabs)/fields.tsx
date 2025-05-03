

import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../../context/ThemeContext"
import { useFarmStore, type Field } from "../../store/farmStore"
import { MapPin, Droplet, Activity, Plus } from "react-native-feather"
import { Link } from "expo-router"

export default function FieldsScreen() {
  const { colors } = useTheme()
  const { fields } = useFarmStore()

  const renderFieldItem = ({ item }: { item: Field }) => (
    <Link href={`/field/${item.id}`} asChild>
      <TouchableOpacity style={[styles.fieldCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Image source={{ uri: item.image }} style={styles.fieldImage} />
        <View style={styles.fieldContent}>
          <View style={styles.fieldHeader}>
            <Text style={[styles.fieldName, { color: colors.text }]}>{item.name}</Text>
            <View style={styles.locationContainer}>
              <MapPin width={12} height={12} stroke={colors.text} />
              <Text style={[styles.locationText, { color: colors.text }]}>{item.location}</Text>
            </View>
          </View>

          <View style={styles.fieldDetails}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>Size:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{item.size} ha</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>Current Crop:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{item.currentCrop}</Text>
            </View>

            <View style={styles.metricsRow}>
              <View style={[styles.metricItem, { backgroundColor: colors.background }]}>
                <Droplet width={16} height={16} stroke="#1D4ED8" />
                <Text style={styles.metricValue}>{item.soilMoisture}%</Text>
                <Text style={styles.metricLabel}>Moisture</Text>
              </View>

              <View style={[styles.metricItem, { backgroundColor: colors.background }]}>
                <Activity width={16} height={16} stroke="#10B981" />
                <Text style={styles.metricValue}>pH {item.soilpH}</Text>
                <Text style={styles.metricLabel}>Soil pH</Text>
              </View>
            </View>

            <View style={styles.harvestInfo}>
              <Text style={[styles.harvestDate, { color: colors.text }]}>
                Harvest:{" "}
                {new Date(item.harvestDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
              <Text style={[styles.yieldText, { color: colors.primary }]}>Expected Yield: {item.expectedYield}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Fields</Text>
        <Link href="/field/new" asChild>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
            <Plus width={20} height={20} stroke="white" />
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={fields}
        renderItem={renderFieldItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  fieldCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
  },
  fieldImage: {
    width: "100%",
    height: 150,
  },
  fieldContent: {
    padding: 16,
  },
  fieldHeader: {
    marginBottom: 12,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
    opacity: 0.7,
  },
  fieldDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  harvestInfo: {
    marginTop: 8,
  },
  harvestDate: {
    fontSize: 14,
    fontWeight: "500",
  },
  yieldText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
})
