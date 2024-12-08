import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useDeletePost,
  useGetPostById,
  useAddComment,
  useDeleteComment,
} from "src/api/posts";

import { useNavigation } from "@react-navigation/native";

const PostScreen = ({ route }) => {
  const { id } = route.params;

  const navigation = useNavigation();

  const {
    data: postData,
    isLoading,
    isError,
    error,
    refetch: refetchPost,
    isFetching,
  } = useGetPostById(id);
  const { mutate: deletePost, isLoading: isDeleting } = useDeletePost();
  const { mutate: addComment } = useAddComment();
  const { mutate: deleteComment } = useDeleteComment();

  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");

  const handleDeletePost = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deletePost(id, {
            onSuccess: () => {
              Alert.alert("Success", "Post has been deleted");
              navigation.goBack();
            },
            onError: (error) => {
              Alert.alert("Error", "Failed to delete post: " + error.message);
            },
          });
        },
      },
    ]);
  };

  const handleAddComment = () => {
    if (!username || !comment) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }
    console.log(id, username, comment);
    addComment(
      { postId: id, commentData: { username, comment } },
      {
        onSuccess: () => {
          Alert.alert("Success", "Comment added");
          setModalVisible(false);
          setUsername("");
          setComment("");
          refetchPost();
        },
        onError: (error) => {
          Alert.alert("Error", "Failed to add comment: " + error.message);
        },
      }
    );
  };

  // Handle pull-to-refresh
  const handleRefresh = () => {
    refetchPost();
  };

  const handleDeleteComment = (commentId) => {
    console.log(commentId);
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteComment(commentId, {
              onSuccess: () => {
                Alert.alert("Success", "Comment has been deleted");
                refetchPost();
              },
              onError: (error) => {
                Alert.alert(
                  "Error",
                  "Failed to delete comment: " + error.message
                );
              },
            });
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ textAlign: "center" }}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.postContainer}>
        <Text style={styles.title}>{postData.title}</Text>
        <Text style={styles.description}>{postData.description}</Text>
      </View>

      <Text style={styles.commentsHeader}>Comments</Text>

      {postData.comments && postData.comments.length > 0 ? (
        <FlatList
          data={postData.comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.comment}>{item.comment}</Text>
              <Button
                title="Delete Comment"
                onPress={() => handleDeleteComment(item.id)}
              />
            </View>
          )}
          // Pull-to-refresh properties
          onRefresh={handleRefresh}
          refreshing={isFetching}
          ListEmptyComponent={() => (
            <View style={styles.center}>
              <Text>No posts found</Text>
            </View>
          )}
        />
      ) : (
        <View style={styles.center}>
          <Text>No comments available</Text>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <Button
          title="Add Comment"
          color="#0000ff"
          onPress={() => setModalVisible(true)}
        />
        <Button
          title={isDeleting ? "Deleting..." : "Delete Post"}
          color="#ff0000"
          onPress={handleDeletePost}
          disabled={isDeleting}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Comment</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Comment"
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAddComment}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
    marginTop: 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  commentContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  comment: {
    fontSize: 14,
    color: "#333",
  },
  buttonsContainer: {
    // flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ff0000",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
