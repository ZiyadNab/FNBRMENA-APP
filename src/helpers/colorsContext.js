// colorStore.js
import { create } from 'zustand';
import * as FileSystem from 'expo-file-system';
import colors from '../../colors.json';

const fileUri = FileSystem.documentDirectory + 'colors.json';

const useColorStore = create((set) => ({
  jsonData: colors,
  loadJson: async () => {
    try {
      const jsonString = await FileSystem.readAsStringAsync(fileUri);
      const data = JSON.parse(jsonString);
      set({ jsonData: data });
    } catch (error) {
      console.log('Error reading JSON file:', error);
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(colors));
      useColorStore.getState().loadJson();
    }
  },
  updateJsonData: async (updatedData) => {
    set({ jsonData: updatedData });
    try {
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedData));
      console.log('JSON file updated successfully.');
    } catch (error) {
      console.log('Error writing JSON file:', error);
    }
  }
}));

// Initial load of the JSON data
useColorStore.getState().loadJson();

export default useColorStore;
