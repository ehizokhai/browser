// Define all your global styles here
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  browser: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: 'skyblue',
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  disabled: {
    opacity: 0.3,
  },
  browserTitleContainer: {
    height: 30,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  browserTitle: {
    fontWeight: 'bold',
  },
  browserBar: {
    height: 50,
    backgroundColor: '#3b3c36',
    flexDirection: 'row',
    alignItems: 'center',
  },
  browserAddressBar: {
    height: 40,
    color: '#f2f2f2',
    backgroundColor: '#343434',
    borderRadius: 3,
    flex: 1,
    borderWidth: 0,
    marginHorizontal: 10,
    marginBottom: 8,
  },
  browserContainer: {
    flex: 2,
  },
  bottomTab: {
    backgroundColor: '#3b3c36',
    height: 30,
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  safeAreaBgColor: {
    backgroundColor: '#3b3c36',
  },
  mgLeft: {
    marginLeft: 10,
  },
});

export default styles;
