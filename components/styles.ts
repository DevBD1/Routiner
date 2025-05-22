import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 4,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  progressCircle: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    borderWidth: 8,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 80,
  },
  habitCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
  },
  correctText: {
    color: "#4caf50",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ff6f61",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 32,
    lineHeight: 32,
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  //  title: {
  //    color: "white",
  //    fontSize: 42,
  //    fontWeight: "bold",
  //    textAlign: "center",
  //    backgroundColor: "rgba(0,0,0,0.5)",
  //    marginBottom: 120,
  //  },
  button: {
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 4,
  },
  // LOGO
  logoStyle: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginLeft: 0,
    marginTop: 0,
    marginRight: 16,
  },
  // TEXT
  infoText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "left",
    paddingTop: 12,
    paddingLeft: 12,
    marginTop: 0,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    textAlign: "center",
  },
  incorrectText: {
    color: "#F44336",
    fontSize: 16,
    textAlign: "center",
  },
  //  correctText: {
  //    color: "#4CAF50",
  //    fontSize: 16,
  //    textAlign: "center",
  //  },
  mottoText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "left",
    minWidth: 256,
    flexShrink: 1,
  },
  // HEADER
  headerContainer: {
    backgroundColor: "#1e2124",
    flexDirection: "row",
    alignItems: "center",
    flex: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 13,
  },
  headerContainerMotto: {
    paddingRight: 16,
    flex: 1,
  },
  // FOOTER
  tabBarContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
  },
  // MAIN CONTAINER
  //  container: {
  //    backgroundColor: "#282b30",
  //    flex: 1,
  //    padding: 16,
  //  },
  contentContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: "#424549",
    borderColor: "#8C8C8C",
    borderRadius: 25,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardWrapper: {
    overflow: "hidden",
    borderRadius: 24,
  },
  cardTitle: {
    color: "#FFFFFF",
    backgroundColor: "#7289da",
    padding: 4,
    fontSize: 20,
    textAlign: "center",
  },
  //  cardText: {
  //    color: "#FFFFFF",
  //    marginBottom: 0,
  //    lineHeight: 20,
  //    fontSize: 13,
  //  },
  //  button: {
  //    backgroundColor: "#7289da",
  //    marginTop: 0,
  //  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContent: {
    height: 40,
  },
  buttonLabel: {
    fontSize: 15,
    letterSpacing: 0.5,
    color: "#FFFFFF",
  },
  icon: {
    marginRight: 10,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
  },
  link: {
    color: "lightblue",
    textDecorationLine: "underline",
    backgroundColor: "#424549",
    padding: 10,
    fontSize: 20,
    textAlign: "center",
  },
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  userTextInfo: {
    flex: 1,
    marginRight: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileImageOverlay: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 4,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    paddingVertical: 8,
  },
  documentButton: {
    marginTop: 8,
    backgroundColor: "#7289da",
    width: "100%",
    borderRadius: 4,
    paddingVertical: 0,
  },
  // QUIZ
  questionCard: {
    backgroundColor: "#53565A",
    padding: 16,
  },
  answerCard: {
    padding: 16,
  },
  surface: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: "#424549",
    borderWidth: 1,
    borderColor: "#8C8C8C",

    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  surfaceText: {
    marginBottom: 16,
    textAlign: "center",
    color: "#FFFFFF",
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    color: "#FFFFFF",
  },
  questionNumber: {
    color: "#FFFFFF",
    marginBottom: 8,
  },
  questionText: {
    color: "#FFFFFF",
    marginBottom: 24,
  },
  optionText: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 14,
  },
  loadingText: {
    color: "#FFFFFF",
    paddingHorizontal: 10,
    marginTop: 16,
    textAlign: "center",
  },
  picker: {
    color: "#FFFFFF",
    marginBottom: 16,
    width: "80%",
  },
  pickerItem: {
    color: "#FFFFFF",
  },
});
