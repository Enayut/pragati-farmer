import { View, Text, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../../context/ThemeContext"
import { useFarmStore } from "../../store/farmStore"
import { DollarSign, TrendingUp } from "react-native-feather"
import { BarChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"

const { width } = Dimensions.get("window")

export default function ForecastScreen() {
  const { colors } = useTheme()
  const { recommendedCrops } = useFarmStore()

  // Sort crops by expected revenue
  const sortedCrops = [...recommendedCrops].sort((a, b) => b.expectedRevenue - a.expectedRevenue)

  // Function to shorten crop names for chart labels
  const shortenName = (name:any) => {
    if (name.length > 6) {
      return name.substring(0, 6) + '..';
    }
    return name;
  };

  // Prepare data for bar chart
  const chartData = {
    labels: sortedCrops.map((crop) => shortenName(crop.name)),
    datasets: [
      {
        data: sortedCrops.map((crop) => crop.expectedRevenue),
      },
    ],
  }

  // Calculate total expected revenue
  const totalRevenue = sortedCrops.reduce((sum, crop) => sum + crop.expectedRevenue, 0)

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Revenue Forecast</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.summaryHeader}>
            <DollarSign width={24} height={24} stroke={colors.primary} />
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Total Expected Revenue</Text>
          </View>

          <Text style={[styles.totalRevenue, { color: colors.text }]}>${totalRevenue.toLocaleString()}</Text>

          <View style={styles.summaryFooter}>
            <TrendingUp width={16} height={16} stroke="#10B981" />
            <Text style={styles.summaryFooterText}>Based on current market prices and expected yields</Text>
          </View>
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Revenue by Crop</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={chartData}
              width={Math.max(width - 40, sortedCrops.length * 60)} // Ensure enough width based on number of crops
              height={250}
              yAxisLabel="$"
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 255, 128, ${opacity})`,
                labelColor: () => colors.text,
                style: {
                  borderRadius: 16,
                },
                barPercentage: 0.7, // Reduced to create more space between bars
                verticalLabelRotation: 45, // Rotate labels
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
                paddingBottom: 15, // Add padding to accommodate rotated labels
              }}
              fromZero={true}
            />
          </ScrollView>
        </View>

        <View style={styles.cropListContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Crop Revenue Details</Text>

          {sortedCrops.map((crop) => (
            <View key={crop.id} style={[styles.cropItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cropHeader}>
                <View style={styles.cropNameContainer}>
                  <Text style={styles.cropIcon}>{crop.icon}</Text>
                  <Text style={[styles.cropName, { color: colors.text }]}>{crop.name}</Text>
                </View>
                <Text style={[styles.cropRevenue, { color: colors.primary }]}>
                  ${crop.expectedRevenue.toLocaleString()}
                </Text>
              </View>

              <View style={styles.cropDetails}>
                <View style={styles.cropDetailItem}>
                  <Text style={[styles.detailLabel, { color: colors.text }]}>Planting:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {new Date(crop.plantingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </Text>
                </View>

                <View style={styles.cropDetailItem}>
                  <Text style={[styles.detailLabel, { color: colors.text }]}>Harvest:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {new Date(crop.harvestDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </Text>
                </View>

                <View style={styles.cropDetailItem}>
                  <Text style={[styles.detailLabel, { color: colors.text }]}>Risk Level:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color:
                          crop.riskLevel === "low" ? "#10B981" : crop.riskLevel === "medium" ? "#F59E0B" : "#EF4444",
                      },
                    ]}
                  >
                    {crop.riskLevel.charAt(0).toUpperCase() + crop.riskLevel.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  summaryCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  totalRevenue: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 12,
  },
  summaryFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryFooterText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#10B981",
  },
  chartCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  cropListContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  cropItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cropHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cropNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cropIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  cropName: {
    fontSize: 18,
    fontWeight: "600",
  },
  cropRevenue: {
    fontSize: 18,
    fontWeight: "700",
  },
  cropDetails: {
    gap: 8,
  },
  cropDetailItem: {
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
})
