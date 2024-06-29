import React, { useState, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, I18nManager, Modal, ActivityIndicator } from 'react-native';
import useColorStore from '../helpers/colorsContext';

import ColorPicker, { Panel1, InputWidget, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import i18next from '../../localization/i18n.js'
import { useTranslation } from 'react-i18next';

export default function Appearance({ navigation }) {
    const { t } = useTranslation()
    const [activePalette, setActivePalette] = useState(null);
    const [activeColor, setActiveColor] = useState('white');
    const [showLanguages, setShowLanguages] = useState(false);
    const [loading, setLoading] = useState(false);
    let cachedLanguage = i18next.language;

    const { jsonData, updateJsonData } = useColorStore();

    const handleColorSelect = (palette, hex) => {
        setActiveColor(hex);
        const updatedData = {
            ...jsonData,
            app: {
                ...jsonData.app,
                [palette]: hex
            }
        };
        updateJsonData(updatedData);
    };

    const togglePalette = (palette) => {
        setActivePalette(activePalette === palette ? null : palette);
        setActiveColor(jsonData.app[palette] || 'white');
    };

    const toggleLanguageList = () => {
        setShowLanguages(!showLanguages);
    };

    const renderColorPicker = (palette) => (
        <View style={{ alignItems: "center", display: activePalette === palette ? 'flex' : 'none', marginTop: 15 }}>
            <ColorPicker style={{ width: '90%' }} value={activeColor} onComplete={({ hex }) => handleColorSelect(palette, hex)}>
                <Preview />
                <Panel1 style={{ marginTop: 10 }} />
                <HueSlider style={{ marginTop: 10 }} />
                <OpacitySlider style={{ marginTop: 10 }} />
                <InputWidget
                    disableAlphaChannel={true}
                    defaultFormat='HEX'
                    formats={["HEX"]}
                    inputStyle={{ marginTop: 10, borderColor: activeColor, color: activeColor }}
                    inputProps={{ cursorColor: activeColor, selectionColor: activeColor, placeholderTextColor: activeColor }}
                    inputTitleStyle={{ display: "none" }}
                />
            </ColorPicker>
        </View>
    );

    const renderPalette = (palette, label) => (
        <View style={{ width: '90%', padding: 15, borderRadius: 10, backgroundColor: '#191919', marginTop: 10 }}>
            <TouchableOpacity onPress={() => togglePalette(palette)} style={{ paddingVertical: 10 }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginLeft: 10,
                    marginRight: 10
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 10
                    }}>
                        <Ionicons name="color-palette" size={24} color="white" />
                        <View style={{ marginLeft: 20, maxWidth: "77%" }}>
                            <Text style={{ color: "white", fontSize: 18 }}>{label}</Text>
                        </View>
                    </View>
                    <AntDesign name="down" size={24} color="white" />
                </View>
            </TouchableOpacity>
            {renderColorPicker(palette)}
        </View>
    );

    const languages = [
        { code: 'en', label: 'English', emoji: '🇬🇧' },
        { code: 'ar', label: 'Arabic', emoji: '🇸🇦' },
        { code: 'de', label: 'German', emoji: '🇩🇪' },
        { code: 'es', label: 'Spanish', emoji: '🇪🇸' },
        { code: 'fr', label: 'French', emoji: '🇫🇷' },
        { code: 'it', label: 'Italian', emoji: '🇮🇹' },
        { code: 'pl', label: 'Polish', emoji: '🇵🇱' },
        { code: 'pt-BR', label: 'Brazilian Portuguese', emoji: '🇧🇷' },
        { code: 'tr', label: 'Turkish', emoji: '🇹🇷' },
    ];

    function updateLanguage(lang) {
        if (lang.code) {
            setLoading(true);  // Show the loading modal
            i18next.changeLanguage(lang.code)
                .then(() => {
                    I18nManager.forceRTL(lang.code === "ar");
                })
                .finally(() => {
                    setTimeout(() => {
                        setLoading(false);  // Hide the loading modal after a 5-second delay
                    }, 5000);
                });
        }
    }

    const renderLanguageList = () => (
        <View style={{ alignItems: "center", display: showLanguages ? 'flex' : 'none' }}>
            <View style={{ width: '100%', backgroundColor: '#191919', borderRadius: 10, padding: 15 }}>
                {languages.map((lang, index) => (
                    <TouchableOpacity onPress={() => updateLanguage(lang)} key={index} style={{ backgroundColor: cachedLanguage === lang.code ? jsonData.app.secondray : jsonData.app.top, padding: 10, borderRadius: 5, marginVertical: 5 }}>
                        <Text style={{ color: 'white', fontSize: 18 }}>{`${lang.emoji} ${lang.label}`}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>

            <Modal
                transparent={true}
                visible={loading}
                animationType="fade"
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={{
                        marginTop: 10,
                        color: '#ffffff',
                        fontSize: 16,
                    }}>Loading...</Text>
                </View>
            </Modal>

            <ScrollView>
                <View style={{ marginTop: 20, marginLeft: 20 }}>
                    <Text style={{ color: 'gray', textAlign: 'left' }}>{t("color_appearance")}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    {renderPalette('secondray', t("secondray_color"))}
                </View>

                <View style={{ marginTop: 20, marginLeft: 20 }}>
                    <Text style={{ color: 'gray', textAlign: 'left' }}>{t("language_appearance")}</Text>
                </View>
                <View style={{ marginTop: 10, alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ width: '90%', padding: 15, borderRadius: 10, backgroundColor: '#191919' }}>
                        <TouchableOpacity onPress={toggleLanguageList} style={{ paddingVertical: 10 }}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginLeft: 10,
                                marginRight: 10
                            }}>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginLeft: 10
                                }}>
                                    <Ionicons name="language" size={24} color="white" />
                                    <View style={{ marginLeft: 20, maxWidth: "77%" }}>
                                        <Text style={{ color: "white", fontSize: 18 }}>{t("select_language")}</Text>
                                    </View>
                                </View>
                                <AntDesign name="down" size={24} color="white" />
                            </View>
                        </TouchableOpacity>
                        {renderLanguageList()}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}