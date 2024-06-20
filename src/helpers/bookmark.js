import React, { createContext, useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

const CACHE_BOOKMARKS_URI = `${FileSystem.documentDirectory}bookmarks_cached_data.json`;

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        const loadBookmarks = async () => {
            const bookmarksInfo = await FileSystem.getInfoAsync(CACHE_BOOKMARKS_URI);
            if (bookmarksInfo.exists) {
                const cachedData = JSON.parse(await FileSystem.readAsStringAsync(CACHE_BOOKMARKS_URI));
                setBookmarks(cachedData);
            }
        };

        loadBookmarks();
    }, []);

    const toggleBookmark = async (itemId) => {
        let updatedBookmarks = [...bookmarks];
        if (updatedBookmarks.includes(itemId)) {
            updatedBookmarks = updatedBookmarks.filter(id => id !== itemId);
        } else {
            updatedBookmarks.push(itemId);
        }

        await FileSystem.writeAsStringAsync(CACHE_BOOKMARKS_URI, JSON.stringify(updatedBookmarks), { encoding: FileSystem.EncodingType.UTF8 });
        setBookmarks(updatedBookmarks);
    };

    return (
        <BookmarkContext.Provider value={{ bookmarks, toggleBookmark }}>
            {children}
        </BookmarkContext.Provider>
    );
};

export const useBookmarks = () => React.useContext(BookmarkContext);
