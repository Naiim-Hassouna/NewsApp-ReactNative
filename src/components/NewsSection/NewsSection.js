import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BookmarkSquareIcon } from "react-native-heroicons/solid";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function NewsSection({ newsProps }) {
  const navigation = useNavigation();
  const [urlList, setUrlList] = useState([]);
  const [bookmarkStatus, setBookmarkStatus] = useState([]);

  useEffect(() => {
    const urls = newsProps.map((item) => item.url);
    setUrlList(urls);
  }, [newsProps]);

  const handleClick = (item) => {
    navigation.navigate("NewsDetails", item);
  };

  const toggleBookmarkAndSave = async (item, index) => {
    try {
      const savedArticles = await AsyncStorage.getItem("savedArticles");
      const savedArticlesArray = savedArticles ? JSON.parse(savedArticles) : [];

      const isArticleBookmarked = savedArticlesArray.some(
        (savedArticle) => savedArticle.url === item.url
      );

      if (!isArticleBookmarked) {
        savedArticlesArray.push(item);
      } else {
        const updatedSavedArticlesArray = savedArticlesArray.filter(
          (savedArticle) => savedArticle.url !== item.url
        );
        await AsyncStorage.setItem(
          "savedArticles",
          JSON.stringify(updatedSavedArticlesArray)
        );
      }

      const updatedStatus = [...bookmarkStatus];
      updatedStatus[index] = !isArticleBookmarked;
      setBookmarkStatus(updatedStatus);
    } catch (error) {
      console.log("Error Saving/Removing Article", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadSavedArticles = async () => {
        try {
          const savedArticles = await AsyncStorage.getItem("savedArticles");
          const savedArticlesArray = savedArticles
            ? JSON.parse(savedArticles)
            : [];

          const isArticleBookmarkedList = urlList.map((url) =>
            savedArticlesArray.some((savedArticle) => savedArticle.url === url)
          );

          setBookmarkStatus(isArticleBookmarkedList);
        } catch (error) {
          console.log("Error Loading Saved Articles", error);
        }
      };

      loadSavedArticles();
    }, [navigation, urlList])
  );

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => handleClick(item)}>
        <View style={{ flexDirection: "row", marginVertical: hp(2) }}>
          <Image
            source={{
              uri: item.image || "https://via.placeholder.com/150",
            }}
            style={{ width: hp(9), height: hp(10), borderRadius: hp(1) }}
            resizeMode="cover"
          />
          <View style={{ flex: 1, marginLeft: hp(2) }}>
            <Text numberOfLines={2} ellipsizeMode="tail">
              {item.title}
            </Text>
            <Text style={{ fontSize: hp(1.5), color: "gray" }}>
              {item.source.name}
            </Text>
          </View>
          <TouchableOpacity onPress={() => toggleBookmarkAndSave(item, index)}>
            <BookmarkSquareIcon
              color={bookmarkStatus[index] ? "blue" : "gray"}
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={newsProps}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingHorizontal: hp(2) }}
      showsVerticalScrollIndicator={false}
    />
  );
}
