
# react-native-user-agent-handler

## Getting started

`$ npm install react-native-user-agent-handler --save`

### Mostly automatic installation

`$ react-native link react-native-user-agent-handler`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-user-agent-handler` and add `RNUserAgentHandler.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNUserAgentHandler.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNUserAgentHandlerPackage;` to the imports at the top of the file
  - Add `new RNUserAgentHandlerPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-user-agent-handler'
  	project(':react-native-user-agent-handler').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-user-agent-handler/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-user-agent-handler')
  	```


## Usage
```javascript
import RNUserAgentHandler from 'react-native-user-agent-handler';

// TODO: What to do with the module?
RNUserAgentHandler;
```
  