import { Tabs } from "expo-router"
import { useTheme } from "../../context/ThemeContext"
import { Home, Feather, Calendar, ShoppingBag, BarChart2 } from "react-native-feather"
import { Platform } from "react-native"

export default function TabsLayout() {
  const { colors, radius } = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 85 : 64,
          borderTopWidth: 1,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
          marginBottom: Platform.OS === 'ios' ? 4 : 2,
          fontFamily: 'Inter-Medium',
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Home stroke={color} width={size-4} height={size-4} />,
        }}
      />
      <Tabs.Screen
        name="fields"
        options={{
          title: "Fields",
          tabBarIcon: ({ color, size }) => <Feather stroke={color} width={size-4} height={size-4} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Marketplace",
          tabBarIcon: ({ color, size }) => <ShoppingBag stroke={color} width={size-4} height={size-4} />,
        }}
      />
      <Tabs.Screen
        name="forecast"
        options={{
          title: "Forecast",
          tabBarIcon: ({ color, size }) => <BarChart2 stroke={color} width={size-4} height={size-4} />,
        }}
      />
      <Tabs.Screen
        name="planning"
        options={{
          title: "Planning",
          tabBarIcon: ({ color, size }) => <Calendar stroke={color} width={size-4} height={size-4} />,
        }}
      />
    </Tabs>
  )
}
