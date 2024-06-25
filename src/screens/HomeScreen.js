import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { fetchBreakingNews, fetchRecommendedNews } from "../../utils/NewsApi";
import Loading from "../components/Loading/Loading";
import Header from "../components/Header/Header";
import NewsSection from "../components/NewsSection/NewsSection";
import MiniHeader from "../components/Header/MiniHeader";
import BreakingNews from "../components/BreakingNews";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function HomeScreen() {
  const { data: breakingNewsData, isLoading: isBreakingLoading } = useQuery({
    queryKey: ["breakingNews"],
    queryFn: fetchBreakingNews,
  });

  const { data: recommendedNewsData, isLoading: isRecommendedLoading } =
    useQuery({
      queryKey: ["recommendedNews"],
      queryFn: fetchRecommendedNews,
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <Header />

        {isBreakingLoading ? (
          <Loading />
        ) : (
          <View style={{ marginBottom: hp(3) }}>
            <MiniHeader label="Breaking News" />
            <BreakingNews data={breakingNewsData.articles} />
          </View>
        )}

        <View>
          <MiniHeader label="Recommended" />
          <ScrollView
            contentContainerStyle={{ paddingBottom: hp(8) }}
            showsVerticalScrollIndicator={false}
          >
            {isRecommendedLoading ? (
              <Loading />
            ) : (
              <NewsSection newsProps={recommendedNewsData.articles} />
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
