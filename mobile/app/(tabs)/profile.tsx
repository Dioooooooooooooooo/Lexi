import { useUserStore } from "@/stores/userStore";
import { API_URL } from "@/utils/constants";
import { router } from "expo-router";

import { Image, ScrollView, TouchableOpacity, View } from "react-native";

import { Book, Settings, Smartphone, Star, Zap } from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

import { AwardIcon } from "@/components/AchievementDisplay";
import BackHeader from "@/components/BackHeader";
import ProfileStat from "@/components/ProfileStat";
import { CurrentTierName, ProgressBar } from "@/components/ProgressBar";
import { StreakIcon } from "@/components/Streak";
import { Achievement } from "@/models/Achievement";
import { useProfileStats } from "@/services/UserService";
import { useAuthStore } from "@/stores/authStore";
import { useMiniGameStore } from "@/stores/miniGameStore";
import { useState } from "react";
import { ActivityIndicator } from "react-native-paper";
const STREAK_COLOR = "#FF663E";

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const setAchievements = useMiniGameStore((state) => state.setAchievements);
  const [logoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);
  const logout = useAuthStore((state) => state.logout);
  const isPupil = user?.role === "Pupil";

  const [
    achievementsQuery,
    screenTimeQuery,
    loginStreakQuery,
    totalBooksQuery,
  ] = useProfileStats(isPupil);

  if (
    achievementsQuery.isLoading ||
    screenTimeQuery.isLoading ||
    loginStreakQuery.isLoading ||
    totalBooksQuery.isLoading
  ) {
    return (
      <View className="flex-1 justify-center items-center absolute inset-0 z-50">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Loading...</Text>
      </View>
    );
  }

  setAchievements(achievementsQuery.data);
  console.log("acsuehmet:", achievementsQuery.data);

  const formatScreenTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const handleLogout = () => {
    logout();
    router.dismissAll();
    router.replace("/");
  };

  return (
    <ScrollView className="bg-background">
      <View className="h-[150px] w-full rounded-bl-[40px] bg-yellowOrange p-4 rounded-xl border-lightGray border-b-4">
        <View className="flex flex-row justify-between">
          <BackHeader />

          <Button
            className="self-end bg-transparent"
            onPress={async () => {
              router.push("/profile/settings");
            }}
          >
            <Settings color="black" />
          </Button>
        </View>
      </View>

      <View
        className="flex p-8 gap-4"
        style={{ position: "relative", bottom: 90 }}
      >
        <View className="flex flex-row justify-between items-end">
          <View className="h-32 w-32 rounded-full border-[5px] border-white">
            <Image
              source={
                user?.avatar
                  ? {
                      uri: `${API_URL.replace(
                        /\/api\/?$/,
                        "/"
                      )}${user.avatar.replace(/^\/+/, "")}`,
                    }
                  : require("@/assets/images/default_pfp.png")
              }
              className="rounded-full shadow-lg w-full h-full"
              resizeMode="contain"
              alt="User profile pic"
            />
          </View>
          <View className="self-end">
            {user?.role === "Pupil" && (
              <CurrentTierName level={user?.pupil?.level!} />
            )}
          </View>
        </View>

        <View className="w-full mt-4 flex gap-4">
          <View className="flex-row justify-between">
            <View className="pb-5">
              <Text className="text-lg font-bold">
                {user?.firstName} {user?.lastName}
              </Text>
              <Text>@{user?.userName}</Text>
            </View>

            <View>
              {user?.role === "Pupil" ? (
                <>
                  <View className="flex flex-row gap-2 items-center">
                    <Zap color="#FFD43B" />
                    <Text className="text-lg font-bold">
                      {user?.pupil?.level ? user?.pupil?.level : 0}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-800">
                    Reading Compr. Level
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-xl font-bold">Teacher</Text>
                </>
              )}
            </View>
          </View>
          {user?.role === "Pupil" ? (
            <>
              <ProgressBar level={user!.pupil!.level!} />
              <Text className="text-xl font-bold">Overview</Text>

              <View className="flex flex-col flex-wrap justify-between">
                <View className="flex flex-row">
                  <ProfileStat
                    level={`${loginStreakQuery.data.longestStreak}`}
                    description="Longest Streak"
                    icon={<StreakIcon color={STREAK_COLOR} size={28} />}
                  />
                  <ProfileStat
                    level={`${totalBooksQuery.data}`}
                    description="Books Read"
                    icon={<Book color="blue" />}
                  />
                </View>
                <View className="flex flex-row">
                  <ProfileStat
                    level={
                      screenTimeQuery !== undefined
                        ? formatScreenTime(screenTimeQuery.data)
                        : "0"
                    }
                    description="Total Screentime"
                    icon={<Smartphone color="black" />}
                  />
                  <ProfileStat
                    level={`${achievementsQuery.data.length}`}
                    description="Achievements"
                    icon={<Star color="#FFD43B" />}
                  />
                </View>
              </View>

              <View className="my-4">
                <View className="flex-row justify-between">
                  <Text className="text-xl font-bold my-2">Achievements</Text>
                  <Text
                    className="underline"
                    onPress={async () => {
                      router.push("/profile/achievementslist");
                    }}
                  >
                    View All
                  </Text>
                </View>

                <View className="flex-row flex gap-4">
                  {achievementsQuery.data.map(
                    (a: Achievement, index: number) => (
                      <AwardIcon badge={`${a.badge}`} key={index} />
                    )
                  )}
                </View>
              </View>
            </>
          ) : (
            <View className="items-center p-4">
              <Image
                source={require("assets/images/teacher-profile.png")}
                resizeMode="contain"
              />
              <Text className="p-2 py-6">This user is a teacher!</Text>
            </View>
          )}
        </View>
        <Button
          variant="dropshadow"
          size={null}
          onPress={() => {
            console.log("logging out..");
            setLogoutModalVisible(true);
            console.log(logoutModalVisible);
          }}
          className="bg-yellowOrange mb-16"
        >
          <Text className="font-bold">Log Out</Text>
        </Button>
      </View>

      {logoutModalVisible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: 24,
              margin: 20,
              width: "80%",
              maxWidth: 400,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}
            >
              Log Out
            </Text>
            <Text
              style={{ fontSize: 16, marginBottom: 24, textAlign: "center" }}
            >
              Are you sure you want to log out of your account?
            </Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#2e1e39",
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                }}
                onPress={handleLogout}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Log Out
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: "#D1D5DB",
                }}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={{ color: "#6B7280", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
