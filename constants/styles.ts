import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // TEXT
  headerText: {
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  textSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
  linkClicked: {
    color: "lightblue",
    backgroundColor: "#424549",
    textDecorationLine: "underline",
    padding: 10,
    fontSize: 20,
    textAlign: "center",
  },
  infoText: {
    //color: "#FFFFFF",
    fontSize: 16,
    textAlign: "left",
    paddingTop: 12,
    paddingLeft: 12,
    marginTop: 0,
  },
  errorText: {
    //color: "#FF6B6B",
    fontSize: 16,
    textAlign: "center",
  },
  incorrectText: {
    //color: "#F44336",
    fontSize: 16,
    textAlign: "center",
  },
  correctText: {
    //color: "#4CAF50",
    fontSize: 16,
    textAlign: "center",
  },
  mottoText: {
    //color: "#FFFFFF",
    fontSize: 16,
    textAlign: "left",
    minWidth: 256,
    flexShrink: 1,
  },
  // LAYOUT
  background: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  tabBarContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
  },
  // COMPONENTS
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
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  button: {
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 6,
    //    backgroundColor: "#7289da",
    //    marginTop: 0,
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
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
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
});
