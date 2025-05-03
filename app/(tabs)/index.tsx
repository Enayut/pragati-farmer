import { View, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../../context/ThemeContext"
import { useFarmStore } from "../../store/farmStore"
import { Search, RefreshCw, MapPin, Plus, LogOut } from "react-native-feather"
import WeatherWidget from "../../components/WeatherWidget"
import CropItem from "../../components/CropItem"
import ActionItemCard from "../../components/ActionItemCard"
import { Link } from "expo-router"
import { ThemeToggle } from "../../components/ThemeToggle"
import { Typography } from "../../components/Typography"
import { Card } from "../../components/Card"
import { useUserStore } from "../../store/userStore"

export default function DashboardScreen() {
  const { colors, spacing, radius } = useTheme()
  const { weather, recommendedCrops, actionItems, commodities, fields } = useFarmStore()
  const { user, logoutUser } = useUserStore()

  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Typography variant="heading">
              Hello, {user?.name?.split(' ')[0] || 'Farmer'}
            </Typography>
            <Typography variant="body" color="textSecondary">
              Welcome to your farm dashboard
            </Typography>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={logoutUser}
              style={[styles.iconButton, { backgroundColor: colors.error + '15', marginRight: spacing.md }]}
            >
              <LogOut width={20} height={20} stroke={colors.error} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.iconButton, 
                { backgroundColor: colors.backgroundSecondary, marginLeft: spacing.md }
              ]}
            >
              <RefreshCw width={20} height={20} stroke={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View 
          style={[
            styles.searchContainer, 
            { 
              backgroundColor: colors.backgroundSecondary,
              borderRadius: radius.md
            }
          ]}
        >
          <Search width={20} height={20} stroke={colors.textSecondary} style={styles.searchIcon} />
          <Typography variant="body" color="textSecondary">Search here...</Typography>
        </View>

        <View style={styles.locationContainer}>
          <MapPin width={16} height={16} stroke={colors.primary} />
          <Typography variant="caption" style={{ marginLeft: spacing.xs }}>{weather.location}</Typography>
        </View>

        <WeatherWidget weather={weather} />

        <View style={styles.sectionContainer}>
          <Typography variant="subheading">Commodities and Food</Typography>
          <FlatList
            data={commodities}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.commodityItem, 
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: radius.md
                  }
                ]}
              >
                <Text style={styles.commodityIcon}>{item.icon}</Text>
                <Typography variant="caption" centered>{item.name}</Typography>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.commoditiesContainer}
          />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Typography variant="subheading">My Fields</Typography>
            <Link href="/fields" asChild>
              <TouchableOpacity>
                <Typography variant="small" color="primary">See All</Typography>
              </TouchableOpacity>
            </Link>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.fieldsContainer}
            contentContainerStyle={styles.fieldsContentContainer}
          >
            {fields.map((field) => (
              <Link key={field.id} href={`/field/${field.id}`} asChild>
                <TouchableOpacity 
                  style={[
                    styles.fieldCard,
                    { 
                      borderRadius: radius.lg,
                      backgroundColor: colors.card 
                    }
                  ]}
                >
                  <Image 
                    source={{ uri: field.image }} 
                    style={styles.fieldImage}
                    resizeMode="cover"
                  />
                  <View style={[
                    styles.fieldOverlay, 
                    { borderRadius: radius.lg }
                  ]} />
                  <View style={styles.fieldInfo}>
                    <Typography 
                      variant="bodyLarge" 
                      style={styles.fieldName}
                    >
                      {field.name}
                    </Typography>
                    <View style={styles.fieldMetaInfo}>
                      <MapPin width={12} height={12} stroke="white" style={{ marginRight: 4 }} />
                      <Typography 
                        variant="small" 
                        style={styles.fieldLocation}
                      >
                        {field.location}
                      </Typography>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}

            <Link href="/field/new" asChild>
              <TouchableOpacity 
                style={[
                  styles.addFieldCard,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    borderRadius: radius.lg,
                    borderColor: colors.border
                  }
                ]}
              >
                <Plus width={32} height={32} stroke={colors.primary} />
                <Typography variant="caption" color="primary" style={{ marginTop: spacing.sm }}>
                  Add Field
                </Typography>
              </TouchableOpacity>
            </Link>
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <Typography variant="subheading">Recommended Crops</Typography>
          <View style={styles.recommendedCropsContainer}>
            {recommendedCrops.slice(0, 3).map((crop) => (
              <CropItem key={crop.id} crop={crop} />
            ))}
            <Link href="/crops" asChild>
              <TouchableOpacity 
                style={[
                  styles.viewAllButton, 
                  { 
                    borderColor: colors.primary,
                    borderRadius: radius.md
                  }
                ]}
              >
                <Typography variant="bodyLarge" color="primary">View All</Typography>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View style={[styles.sectionContainer, styles.lastSection]}>
          <Typography variant="subheading">Action Items</Typography>
          <View style={styles.actionItemsContainer}>
            {actionItems.slice(0, 2).map((item) => (
              <ActionItemCard key={item.id} item={item} />
            ))}
            <Link href="/actions" asChild>
              <TouchableOpacity 
                style={[
                  styles.viewAllButton, 
                  { 
                    borderColor: colors.primary,
                    borderRadius: radius.md
                  }
                ]}
              >
                <Typography variant="bodyLarge" color="primary">View All</Typography>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  commoditiesContainer: {
    paddingVertical: 16,
    paddingRight: 20,
  },
  commodityItem: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    width: 80,
    height: 100,
    borderWidth: 1,
    padding: 12,
  },
  commodityIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldsContainer: {
    marginTop: 16,
  },
  fieldsContentContainer: {
    paddingRight: 20,
    paddingVertical: 4,
  },
  fieldCard: {
    width: 220,
    height: 140,
    marginRight: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  fieldImage: {
    width: "100%",
    height: "100%",
    position: 'absolute',
  },
  fieldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  addFieldCard: {
    width: 220,
    height: 140,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    elevation: 1,
  },
  fieldInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  fieldName: {
    color: 'white',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  fieldMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  fieldLocation: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
  },
  recommendedCropsContainer: {
    marginTop: 16,
  },
  viewAllButton: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 16,
  },
  actionItemsContainer: {
    marginTop: 16,
  },
  lastSection: {
    marginBottom: 32,
  },
})
