import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
    StyleSheet, Text, View, TextInput, FlatList, ActivityIndicator,
    RefreshControl, TouchableOpacity, I18nManager, res
} from 'react-native';
import { Octicons, AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import axios from 'axios'
import RenderImage from '../helpers/list'
import { Image } from 'expo-image';
import BottomSheet from '../helpers/BottomSheet';
import { TouchableOpacity as RNGHTouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Portal } from '@gorhom/portal'
import colors from '../../colors.json'
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import i18next from '../../localization/i18n.js'

export default function Home({ navigation }) {
    const { t } = useTranslation()
    let cachedLanguage = i18next.language;

    const cosmeticTypes = [
        {
            id: 'all',
            name: t('all'),
        },
        {
            id: 'outfit',
            name: t('outfit'),
        },
        {
            id: 'pickaxe',
            name: t('pickaxe'),
        },
        {
            id: 'emote',
            name: t('emote'),
        },
        {
            id: 'glider',
            name: t('glider'),
        },
        {
            id: 'backpack',
            name: t('backpack'),
        },
        {
            id: 'pet',
            name: t('pet'),
        },
        {
            id: 'wrap',
            name: t('wrap'),
        },
        {
            id: 'toy',
            name: t('toy'),
        },
        {
            id: 'spray',
            name: t('spray'),
        },
        {
            id: 'music',
            name: t('music'),
        },
        {
            id: 'bannertoken',
            name: t('bannertoken'),
        },
        {
            id: 'cosmeticvariant',
            name: t('cosmeticvariant'),
        },
        {
            id: 'loadingscreen',
            name: t('loadingscreen'),
        },
        {
            id: 'emoji',
            name: t('emoji'),
        },
        {
            id: 'contrail',
            name: t('contrail'),
        },
        {
            id: 'bundle',
            name: t('bundle'),
        },
    ]

    const cosmeticRarities = [
        {
            "id": "Legendary",
            "name": t('legendary'),
        },
        {
            "id": "Epic",
            "name": t('epic')
        },
        {
            "id": "Rare",
            "name": t('rare')
        },
        {
            "id": "Uncommon",
            "name": t('uncommon')
        },
        {
            "id": "CUBESeries",
            "name": t('cube_series')
        },
        {
            "id": "DCUSeries",
            "name": t('dcu_series')
        },
        {
            "id": "FrozenSeries",
            "name": t('frozen_series')
        },
        {
            "id": "CreatorCollabSeries",
            "name": t('creator_collab_series')
        },
        {
            "id": "LavaSeries",
            "name": t('lava_series')
        },
        {
            "id": "MarvelSeries",
            "name": t('marvel_series')
        },
        {
            "id": "PlatformSeries",
            "name": t('platform_series')
        },
        {
            "id": "ShadowSeries",
            "name": t('shadow_series')
        },
        {
            "id": "SlurpSeries",
            "name": t('slurp_series')
        },
        {
            "id": "ColumbusSeries",
            "name": t('columbus_series')
        },
        {
            "id": "Common",
            "name": t('common')
        }
    ]

    const cosmeticTags = [
        {
            "id": "Cosmetics.UserFacingFlags.HasVariants",
            "name": t('cosmeticvariant')
        },
        {
            "id": "Cosmetics.UserFacingFlags.Reactive",
            "name": t('reactive')
        },
        {
            "id": "Cosmetics.UserFacingFlags.Emote.Traversal",
            "name": t('traversal')
        },
        {
            "id": "Cosmetics.UserFacingFlags.BuiltInEmote",
            "name": t('built_in')
        },
        {
            "id": "Cosmetics.UserFacingFlags.Synced",
            "name": t('synced')
        },
        {
            "id": "Cosmetics.UserFacingFlags.Wrap.Animated",
            "name": t('animated')
        },
        {
            "id": "Cosmetics.QuestsMetaData.Achievements.Umbrella",
            "name": t('unbrella')
        },
        {
            "id": "Cosmetics.Gating.RatingMin.Teen",
            "name": t('teen_rated')
        },
        {
            "id": "Cosmetics.UserFacingFlags.Transform",
            "name": t('transform')
        },
        {
            "id": "Cosmetics.UserFacingFlags.GearUp",
            "name": t('gear_up')
        }
    ]

    const cosmeticSources = [
        {
            "id": "Cosmetics.Source.Season",
            "name": t('battlepass'),
            "path": require('../../assets/cosmetics/others/bpstarold.png'),
            "type": "image",
            "colors": ["#FF9E00", "#443200"]
        },
        {
            "id": "Cosmetics.Source.ItemShop",
            "name": t('itemshop'),
            "path": require('../../assets/cosmetics/others/vbucks.png'),
            "type": "image",
            "colors": ["#00FFD4", "#004440"]
        },
        {
            "id": "Cosmetics.Source.CrewPack, Cosmetics.Crew",
            "name": t('crew'),
            "path": require('../../assets/cosmetics/others/fncrew.png'),
            "type": "image",
            "colors": ["#FF0000", "#440000"]
        },
        {
            "id": "Cosmetics.Source.Challenge, Cosmetics.Source.QuestReward, Cosmetics.UserFacingFlags.HasUpgradeQuests",
            "name": t('quests'),
            "path": require('../../assets/cosmetics/others/quests.png'),
            "type": "image",
            "colors": ["#00ADFF", "#002E44"]
        },
        {
            "id": "Cosmetics.Source.RMT, Cosmetics.Source.StarterPack",
            "name": t('packs'),
            "type": "emoji",
            "emoji": "💲",
            "colors": ["#5DFF00", "#194400"]
        },
        {
            "id": "Cosmetics.Source.AnySeason.FirstWin",
            "name": t('first_win'),
            "path": require('../../assets/cosmetics/others/firstwin.png'),
            "type": "image",
            "colors": ["#A500FF", "#2C0044"]
        },
        {
            "id": "Cosmetics.Source.FNCS",
            "name": t('fncs'),
            "path": require('../../assets/cosmetics/others/fncs.png'),
            "type": "image",
            "colors": ["#00FFB9", "#004431"]
        }
    ]

    const cosmeticChapters = [
        {
            "season": 1,
            "chapter": 1,
            "seasonInChapter": 1,
            "displayName": t("s1"),
            "startDate": "2017-10-24 09:00:00+00:00",
            "endDate": "2017-12-14 08:59:59+00:00",
            "path": require('../../assets/seasons/c1s1.png')
        },
        {
            "season": 2,
            "chapter": 1,
            "seasonInChapter": 2,
            "displayName": t("s2"),
            "startDate": "2017-12-14 09:00:00+00:00",
            "endDate": "2018-02-22 08:59:59+00:00",
            "path": require('../../assets/seasons/c1s2.png')
        },
        {
            "season": 3,
            "chapter": 1,
            "seasonInChapter": 3,
            "displayName": t("s3"),
            "startDate": "2018-02-22 09:00:00+00:00",
            "endDate": "2018-05-01 08:59:59+00:00",
            "path": require('../../assets/seasons/c1s3.png')
        },
        {
            "season": 4,
            "chapter": 1,
            "seasonInChapter": 4,
            "displayName": t("s4"),
            "startDate": "2018-05-01 09:00:00+00:00",
            "endDate": "2018-07-11 08:59:59+00:00",
            "path": require('../../assets/seasons/c1s4.png')
        },
        {
            "season": 5,
            "chapter": 1,
            "seasonInChapter": 5,
            "displayName": t("s5"),
            "startDate": "2018-07-11 09:00:00+00:00",
            "endDate": "2018-09-27 08:59:59+00:00",
            "path": require('../../assets/seasons/c1s5.png')
        },
        {
            "season": 6,
            "chapter": 1,
            "seasonInChapter": 6,
            "displayName": t("s6"),
            "startDate": "2018-09-27 09:00:00+00:00",
            "endDate": "2018-12-06 08:59:59+00:00",
            "path": require('../../assets/seasons/c1s6.png')
        },
        {
            "season": 7,
            "chapter": 1,
            "seasonInChapter": 7,
            "displayName": t("s7"),
            "startDate": "2018-12-06 09:00:00+00:00",
            "endDate": "2019-02-28 07:59:59+00:00",
            "path": require('../../assets/seasons/c1s7.png')
        },
        {
            "season": 8,
            "chapter": 1,
            "seasonInChapter": 8,
            "displayName": t("s8"),
            "startDate": "2019-02-28 08:00:00+00:00",
            "endDate": "2019-05-09 07:59:59+00:00",
            "path": require('../../assets/seasons/c1s8.png')
        },
        {
            "season": 9,
            "chapter": 1,
            "seasonInChapter": 9,
            "displayName": t("s9"),
            "startDate": "2019-05-09 08:00:00+00:00",
            "endDate": "2019-08-01 07:59:59+00:00",
            "path": require('../../assets/seasons/c1s9.png')
        },
        {
            "season": 10,
            "chapter": 1,
            "seasonInChapter": 10,
            "displayName": t("s10"),
            "startDate": "2019-08-01 08:00:00+00:00",
            "endDate": "2019-10-13 18:00:00+00:00",
            "path": require('../../assets/seasons/c1s10.png')
        },
        {
            "season": 11,
            "chapter": 2,
            "seasonInChapter": 1,
            "displayName": t("s11"),
            "startDate": "2019-10-15 08:00:00+00:00",
            "endDate": "2020-02-20 08:59:59+00:00",
            "path": require('../../assets/seasons/c2s1.png')
        },
        {
            "season": 12,
            "chapter": 2,
            "seasonInChapter": 2,
            "displayName": t("s12"),
            "startDate": "2020-02-20 09:00:00+00:00",
            "endDate": "2020-06-17 05:59:59+00:00",
            "path": require('../../assets/seasons/c2s2.png')
        },
        {
            "season": 13,
            "chapter": 2,
            "seasonInChapter": 3,
            "displayName": t("s13"),
            "startDate": "2020-06-17 06:00:00+00:00",
            "endDate": "2020-08-27 05:59:59+00:00",
            "path": require('../../assets/seasons/c2s3.png')
        },
        {
            "season": 14,
            "chapter": 2,
            "seasonInChapter": 4,
            "displayName": t("s14"),
            "startDate": "2020-08-27 06:00:00+00:00",
            "endDate": "2020-12-02 04:59:59+00:00",
            "path": require('../../assets/seasons/c2s4.png')
        },
        {
            "season": 15,
            "chapter": 2,
            "seasonInChapter": 5,
            "displayName": t("s15"),
            "startDate": "2020-12-02 05:00:00+00:00",
            "endDate": "2021-03-16 03:59:59+00:00",
            "path": require('../../assets/seasons/c2s5.png')
        },
        {
            "season": 16,
            "chapter": 2,
            "seasonInChapter": 6,
            "displayName": t("s16"),
            "startDate": "2021-03-16 04:00:00+00:00",
            "endDate": "2021-06-08 05:59:59+00:00",
            "path": require('../../assets/seasons/c2s6.png')
        },
        {
            "season": 17,
            "chapter": 2,
            "seasonInChapter": 7,
            "displayName": t("s17"),
            "startDate": "2021-06-08 06:00:00+00:00",
            "endDate": "2021-09-13 05:59:59+00:00",
            "path": require('../../assets/seasons/c2s7.png')
        },
        {
            "season": 18,
            "chapter": 2,
            "seasonInChapter": 8,
            "displayName": t("s18"),
            "startDate": "2021-09-13 06:00:00+00:00",
            "endDate": "2021-12-04 21:15:00+00:00",
            "path": require('../../assets/seasons/c2s8.png')
        },
        {
            "season": 19,
            "chapter": 3,
            "seasonInChapter": 1,
            "displayName": t("s19"),
            "startDate": "2021-12-05 15:00:00+00:00",
            "endDate": "2022-03-20 06:59:59+00:00",
            "path": require('../../assets/seasons/c3s1.png')
        },
        {
            "season": 20,
            "chapter": 3,
            "seasonInChapter": 2,
            "displayName": t("s20"),
            "startDate": "2022-03-20 07:00:00+00:00",
            "endDate": "2022-06-05 06:59:59+00:00",
            "path": require('../../assets/seasons/c3s2.png')
        },
        {
            "season": 21,
            "chapter": 3,
            "seasonInChapter": 3,
            "displayName": t("s21"),
            "startDate": "2022-06-05 07:00:00+00:00",
            "endDate": "2022-09-18 05:59:59+00:00",
            "path": require('../../assets/seasons/c3s3.png')
        },
        {
            "season": 22,
            "chapter": 3,
            "seasonInChapter": 4,
            "displayName": t("s22"),
            "startDate": "2022-09-18 06:00:00+00:00",
            "endDate": "2022-12-03 22:30:00+00:00",
            "path": require('../../assets/seasons/c3s4.png')
        },
        {
            "season": 23,
            "chapter": 4,
            "seasonInChapter": 1,
            "displayName": t("s24"),
            "startDate": "2022-12-04 08:00:00+00:00",
            "endDate": "2023-03-10 05:59:59+00:00",
            "path": require('../../assets/seasons/c4s1.png')
        },
        {
            "season": 24,
            "chapter": 4,
            "seasonInChapter": 2,
            "displayName": t("s25"),
            "startDate": "2023-03-10 06:00:00+00:00",
            "endDate": "2023-06-09 05:59:59+00:00",
            "path": require('../../assets/seasons/c4s2.png')
        },
        {
            "season": 25,
            "chapter": 4,
            "seasonInChapter": 3,
            "displayName": t("s25"),
            "startDate": "2023-06-09 06:00:00+00:00",
            "endDate": "2023-08-25 05:59:59+00:00",
            "path": require('../../assets/seasons/c4s3.png')
        },
        {
            "season": 26,
            "chapter": 4,
            "seasonInChapter": 4,
            "displayName": t("s26"),
            "startDate": "2023-08-25 06:00:00+00:00",
            "endDate": "2023-11-03 05:59:59+00:00",
            "path": require('../../assets/seasons/c4s4.png')
        },
        {
            "season": 27,
            "chapter": 4,
            "seasonInChapter": 5,
            "displayName": t("s27"),
            "startDate": "2023-11-03 06:00:00+00:00",
            "endDate": "2023-12-03 05:59:59+00:00",
            "path": require('../../assets/seasons/c4s5.png')
        },
        {
            "season": 28,
            "chapter": 5,
            "seasonInChapter": 1,
            "displayName": t("s28"),
            "startDate": "2023-12-03 06:00:00+00:00",
            "endDate": "2024-03-08 05:59:59+00:00",
            "path": require('../../assets/seasons/c5s1.png')
        },
        {
            "season": 29,
            "chapter": 5,
            "seasonInChapter": 2,
            "displayName": t("s29"),
            "startDate": "2024-03-08 06:00:00+00:00",
            "endDate": "2024-05-24 05:59:59+00:00",
            "path": require('../../assets/seasons/c5s2.png')
        },
    ]

    const CACHE_FILE_URI = `${FileSystem.documentDirectory}list_cached_data.json`;
    const CACHE_EXPIRATION_TIME = 15 * 60 * 1000;

    const [searchText, setSearchText] = useState('');
    const [selected, setSelected] = useState(0);
    const [cosmetics, setCosmetics] = useState([])
    const [searchedCosmetics, setSearchedCosmetics] = useState([])
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [sortType, setSortType] = useState("of")
    const [filterQuery, setFilterQuery] = useState({
        rarity: [],
        source: [],
        tags: [],
        chapters: []
    });
    const bottomSheetRef = useRef()

    const handleSearch = useCallback((text) => {
        setSearchText(text)
    }, []);

    const handleFilteredTypes = useCallback((index) => {
        setSelected(index);
    }, []);

    const filterCosmetics = useCallback(() => {

        let filteredCosmetics = cosmetics;
        if (selected === 0) {
            filteredCosmetics = filteredCosmetics.filter(item => item.name);
        }

        if (selected !== 0) {
            filteredCosmetics = filteredCosmetics.filter(item => item.type.id.toLowerCase().includes(cosmeticTypes[selected].id.toLowerCase()));
        }

        if (filterQuery.rarity.length > 0) {
            filteredCosmetics = filteredCosmetics.filter(item => {
                return filterQuery.rarity.some(rarity => {
                    if (item.series === null) {
                        return item.rarity.id.toLowerCase().includes(rarity.toLowerCase());
                    } else return item.series.id.toLowerCase().includes(rarity.toLowerCase());
                });
            });
        }

        if (filterQuery.source.length > 0) {
            filteredCosmetics = filteredCosmetics.filter(item => {
                const filterTags = filterQuery.source.flatMap(tag => tag.split(","));
                return filterTags.some(filterTag => {
                    if (filterTag === "Cosmetics.Source.Season") return item.gameplayTags.some(tag => tag.toLowerCase().includes(filterTag.trim().toLowerCase())) || item.battlepass !== null
                    else if (filterTag === "Cosmetics.Source.ItemShop") return item.gameplayTags.some(tag => tag.toLowerCase().includes(filterTag.trim().toLowerCase())) || item.shopHistory !== null
                    else return item.gameplayTags.some(tag => tag.toLowerCase().includes(filterTag.trim().toLowerCase()))
                })
            });
        }

        if (filterQuery.tags.length > 0) {
            filteredCosmetics = filteredCosmetics.filter(item => {
                const filterTags = filterQuery.tags.flatMap(tag => tag.split(","));
                return filterTags.some(filterTag =>
                    item.gameplayTags.some(tag => tag.toLowerCase().includes(filterTag.trim().toLowerCase()))
                );
            });
        }

        if (filterQuery.chapters.length > 0) {
            filteredCosmetics = filteredCosmetics.filter(item => item.introduction !== null)
            filteredCosmetics = filteredCosmetics.filter(item => {
                return filterQuery.chapters.some(chapter => {
                    return item.introduction.text.includes(chapter)
                });
            });
        }

        if (searchText) {
            filteredCosmetics = filteredCosmetics.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
        }

        setSearchedCosmetics(filteredCosmetics);

    }, [cosmetics, searchText, selected, filterQuery]);

    useEffect(() => {
        filterCosmetics();
    }, [filterCosmetics]);

    useEffect(() => {
        fetchData();
    }, [i18next.language]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            let cachedData = null;
            await FileSystem.getInfoAsync(CACHE_FILE_URI)
                .then(async i => {
                    if (i.exists) {
                        const currentTime = new Date().getTime();
                        const modificationTimeMilliseconds = i.modificationTime * 1000
                        // Check if cached data is expired
                        
                        if (currentTime - modificationTimeMilliseconds < CACHE_EXPIRATION_TIME) {

                            // If not expired, read cached data
                            cachedData = await FileSystem.readAsStringAsync(CACHE_FILE_URI);
                        }
                    }

                    if (!cachedData || i18next.language !== cachedLanguage) {

                        // Fetch data from API if no cached data or expired
                        const response = await axios(`https://fortniteapi.io/v2/items/list?lang=${i18next.language}&fields=name,rarity,series,description,id,price,reactive,type,added,builtInEmote,previewVideos,copyrightedAudio,apiTags,upcoming,releaseDate,lastAppearance,images,juno,video,audio,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles,grants,grantedBy,displayAssets`, {
                            headers: {
                                'Authorization': 'd4ce1562-839ff66b-3946ccb6-438eb9cf'
                            }
                        })

                        const jsonData = await response.data;
                        // Save fetched data to cache
                        await FileSystem.writeAsStringAsync(CACHE_FILE_URI, JSON.stringify(jsonData.items), { encoding: FileSystem.EncodingType.UTF8 })
                        cachedData = JSON.stringify(jsonData.items);
                        cachedLanguage = i18next.language
                    }

                    const removeUnWantedItems = JSON.parse(cachedData).filter(item => item.name !== "")
                    const list = removeUnWantedItems.sort((a, b) => new Date(a.added.date) - new Date(b.added.date))
                    setCosmetics(list);
                    setLoading(false);
                    setRefreshing(false);
                })


        } catch (error) {
            console.error('Error fetching data:', error);
            setRefreshing(false); // Set refreshing to false if there's an error
        }
    }, [])

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await FileSystem.getInfoAsync(CACHE_FILE_URI)
            .then(i => {
                if (i.exists) FileSystem.deleteAsync(CACHE_FILE_URI).then(fetchData);
                else fetchData()
            })

    }, [])

    const getRarityPath = useCallback((rarity) => {
        const rarityLower = rarity.toLowerCase();
        switch (rarityLower) {
            case 'cubeseries':
                return require('../../assets/cosmetics/rarities/dark.png');
            case 'frozenseries':
                return require('../../assets/cosmetics/rarities/frozen.png');
            case 'creatorcollabseries':
                return require('../../assets/cosmetics/rarities/icon.png');
            case 'slurpseries':
                return require('../../assets/cosmetics/rarities/slurp.png');
            case 'marvelseries':
                return require('../../assets/cosmetics/rarities/marvel.png');
            case 'lavaseries':
                return require('../../assets/cosmetics/rarities/lava.png');
            case 'shadowseries':
                return require('../../assets/cosmetics/rarities/shadow.png');
            case 'platformseries':
                return require('../../assets/cosmetics/rarities/gaming.png');
            case 'dcuseries':
                return require('../../assets/cosmetics/rarities/dc.png');
            case 'columbusseries':
                return require('../../assets/cosmetics/rarities/starwars.png');
            case 'legendary':
                return require('../../assets/cosmetics/rarities/legendary.png');
            case 'epic':
                return require('../../assets/cosmetics/rarities/epic.png');
            case 'rare':
                return require('../../assets/cosmetics/rarities/rare.png');
            case 'uncommon':
                return require('../../assets/cosmetics/rarities/uncommon.png');
            case 'common':
                return require('../../assets/cosmetics/rarities/common.png');
            default:
                return require('../../assets/cosmetics/rarities/common.png');
        }
    }, [])

    const getTagsPath = useCallback((gameplayTags) => {
        switch (gameplayTags) {
            case 'Cosmetics.UserFacingFlags.HasVariants':
                return require('../../assets/cosmetics/tags/T-Icon-Variant-64.png');
            case 'Cosmetics.UserFacingFlags.Reactive':
                return require('../../assets/cosmetics/tags/T-Icon-Adaptive-64.png');
            case 'Cosmetics.UserFacingFlags.Emote.Traversal':
                return require('../../assets/cosmetics/tags/T-Icon-Traversal-64.png');
            case 'Cosmetics.UserFacingFlags.Synced':
                return require('../../assets/cosmetics/tags/T-Icon-Synced-64x.png');
            case 'Cosmetics.UserFacingFlags.Wrap.Animated':
                return require('../../assets/cosmetics/tags/T-Icon-Animated-64.png');
            default:
                return require('../../assets/cosmetics/types/unknown.png');
        }
    }, [])

    const toggleFilter = useCallback((filterType, filterId) => {
        setFilterQuery(prevState => {

            const prevFilters = prevState[filterType];
            const filterIndex = prevFilters.indexOf(filterId);
            if (filterIndex !== -1) {
                return {
                    ...prevState,
                    [filterType]: prevFilters.filter(id => id !== filterId)
                };
            } else {
                return {
                    ...prevState,
                    [filterType]: [...prevFilters, filterId]
                };
            }
        })
    }, []);

    const resetFilters = () => {
        setFilterQuery({
            rarity: [],
            source: [],
            tags: [],
            chapters: []
        })
    }

    const sortNewestFirst = () => {
        setSortType("nf")
        const sortedData = [...cosmetics];
        sortedData.sort((a, b) => new Date(b.added.date) - new Date(a.added.date));
        setCosmetics(sortedData);

    }

    const sortOldestFirst = () => {
        setSortType("of")
        const sortedData = [...cosmetics];
        sortedData.sort((a, b) => new Date(a.added.date) - new Date(b.added.date));
        setCosmetics(sortedData);
    }

    const sortShopLongest = () => {
        setSortType("sl")
        const sortedData = [...cosmetics];
        sortedData.sort((a, b) => new Date(a.lastAppearance) - new Date(b.lastAppearance));
        setCosmetics(sortedData);
    }

    const sortShopRecent = () => {
        setSortType("sr")
        const sortedData = [...cosmetics];
        sortedData.sort((a, b) => new Date(b.lastAppearance) - new Date(a.lastAppearance));
        setCosmetics(sortedData);
    }

    function sortATOZ() {
        setSortType("az")
        const sortedData = [...cosmetics];
        sortedData.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
        setCosmetics(sortedData);
    }

    function sortZTOA() {
        setSortType("za")
        const sortedData = [...cosmetics];
        sortedData.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA > nameB) return -1;
            if (nameA < nameB) return 1;
            return 0;
        });
        setCosmetics(sortedData);
    }

    const handleRarityButtonClick = useCallback((rarity) => {
        toggleFilter('rarity', rarity);
    }, [toggleFilter]);

    const handleSourceButtonClick = useCallback((sourceId) => {
        toggleFilter('source', sourceId);
    }, [toggleFilter]);

    const handleTagsButtonClick = useCallback((tagId) => {
        toggleFilter('tags', tagId);
    }, [toggleFilter]);

    const handleChaptersButtonClick = useCallback((chapter) => {
        toggleFilter('chapters', chapter);
    }, [toggleFilter]);

    function getImagePath(type) {
        const typeLower = type.toLowerCase();
        switch (typeLower) {
            case 'all':
                return require('../../assets/cosmetics/types/all.png');
            case 'outfit':
                return require('../../assets/cosmetics/types/outfit.png');
            case 'pickaxe':
                return require('../../assets/cosmetics/types/harvesting_tool.png');
            case 'emote':
                return require('../../assets/cosmetics/types/emote.png');
            case 'glider':
                return require('../../assets/cosmetics/types/glider.png');
            case 'backpack':
                return require('../../assets/cosmetics/types/backbling.png');
            case 'pet':
                return require('../../assets/cosmetics/types/pet.png');
            case 'wrap':
                return require('../../assets/cosmetics/types/wrap.png');
            case 'toy':
                return require('../../assets/cosmetics/types/toy.png');
            case 'spray':
                return require('../../assets/cosmetics/types/spray.png');
            case 'music':
                return require('../../assets/cosmetics/types/music.png');
            case 'bannertoken':
                return require('../../assets/cosmetics/types/banner.png');
            case 'cosmeticvariant':
                return require('../../assets/cosmetics/types/style.png');
            case 'loadingscreen':
                return require('../../assets/cosmetics/types/loading_screen.png');
            case 'emoji':
                return require('../../assets/cosmetics/types/emoticon.png');
            case 'contrail':
                return require('../../assets/cosmetics/types/contrail.png');
            case 'bundle':
                return require('../../assets/cosmetics/types/item_bundle.png');
            default:
                return require('../../assets/cosmetics/types/unknown.png');
        }
    }

    function changeLng() {

        i18next.changeLanguage(i18next.language === "ar" ? 'en' : 'ar')
        I18nManager.forceRTL(i18next.language === "ar" ? true : false)
    }

    return (
        <LinearGradient colors={[colors.app.background, "#000"]} style={styles.container}>
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{
                    flexDirection: 'row',
                    marginTop: 50,
                    width: '90%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20
                }}>

                    <TouchableOpacity onPress={changeLng} style={{
                        flexDirection: 'row',
                    }}>
                        <Image source={{ uri: 'https://cdn2.unrealengine.com/fortnite-zeus-icon-200x200-60318da67e43.png' }} style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                        }} />

                        <View style={{
                            flexDirection: 'column',
                            marginLeft: 20,
                        }}>
                            <Text style={{ color: 'white' }}>{t("good_morning")}</Text>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 18,
                                color: 'white'
                            }}>OHY_</Text>
                        </View>
                    </TouchableOpacity>
                    <Octicons name="three-bars" size={30} color="white" />

                </View>

                <View style={{
                    width: '90%',
                    height: 40,
                    backgroundColor: '#191919',
                    borderRadius: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                }}>

                    <TextInput
                        value={searchText}
                        onChangeText={handleSearch}
                        placeholderTextColor={"white"}
                        placeholder={t("search").toUpperCase()}
                        selectionColor={"white"}
                        cursorColor={"white"}
                        style={{
                            flex: 1,
                            height: 40,
                            color: 'white',
                            paddingLeft: 10,
                            fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                        }}
                    />


                    <TouchableOpacity onPress={() => {
                        bottomSheetRef.current?.isActive() ? bottomSheetRef.current?.scrollTo(100) : bottomSheetRef.current?.scrollTo(-385)
                    }} style={{
                        height: 40,
                        padding: 10,
                        backgroundColor: '#191919',
                        borderRadius: 5,
                    }}>
                        <AntDesign name="filter" color={filterQuery.rarity.length > 0 || filterQuery.source.length > 0 || filterQuery.tags.length > 0 || filterQuery.chapters.length > 0 ? "red" : "white"} size={20} />
                        {
                            (filterQuery.rarity.length > 0 || filterQuery.source.length > 0 || filterQuery.tags.length > 0 || filterQuery.chapters.length > 0) && (
                                <View style={{
                                    backgroundColor: "red",
                                    width: 4,
                                    height: 4,
                                    borderRadius: 2,
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                }} />
                            )
                        }

                    </TouchableOpacity>
                </View>

                <ScrollView horizontal={true} directionalLockEnabled={true} bounces={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 40,
                        marginBottom: 20
                    }}>
                        {cosmeticTypes.map((type, index) => (

                            <TouchableOpacity
                                key={index}
                                onPress={() => handleFilteredTypes(index)}
                                style={{
                                    marginRight: 5,
                                    width: 'auto',
                                    borderRadius: 5,
                                    height: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingHorizontal: 15,
                                    backgroundColor: '#191919',
                                    borderRadius: 5,
                                }}
                            >
                                <Image source={getImagePath(type.id)} style={{ width: 25, height: 25, tintColor: selected === index ? colors.app.secondray : 'white', marginRight: 5 }} />
                                <Text style={{
                                    color: selected === index ? colors.app.secondray : 'white',
                                    fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                }}>{type.name.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={loading ? [] : searchedCosmetics}
                    renderItem={({ item }) => <RenderImage item={item} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    onEndReachedThreshold={0.1}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={20}
                    updateCellsBatchingPeriod={5000}
                    initialNumToRender={50}
                    windowSize={15}
                    ListFooterComponent={() => { return loading ? <ActivityIndicator size="large" color="#1473FC" /> : null }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} style={{ marginTop: 5 }} />
                    }
                />
            </View>

            <Portal>
                <BottomSheet ref={bottomSheetRef} type='filter' background={{ color: "#191919" }}>
                    <View style={{
                        marginTop: 20,
                    }}>

                        <View style={{
                            flex: 1
                        }}>
                            <Text style={{
                                color: 'white',
                                fontSize: 18,
                                paddingHorizontal: 20,
                                fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                            }}>{t("rarity").toUpperCase()}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: i18next.language === "ar" ? null : 10,
                                    width: '100%',
                                }}>
                                    {
                                        cosmeticRarities.map((item, index) => (
                                            // <View key={index}>
                                            //     <RNGHTouchableOpacity
                                            //         style={{
                                            //             marginRight: 5,
                                            //             height: 60,
                                            //             borderRadius: 10,
                                            //             padding: 5,
                                            //             backgroundColor: "#222128",
                                            //             alignItems: 'center',
                                            //             flexDirection: 'row',
                                            //             justifyContent: 'center',
                                            //         }}
                                            //         onPress={() => handleRarityButtonClick(item)} // Handle button click
                                            //     >
                                            //         <Image
                                            //             style={{ marginRight: 5, width: 50, height: 50, borderWidth: 2, borderRadius: 10, borderColor: filterQuery.rarity.find(rarity => rarity.rarityId === item.id) ? colors.cosmetics[item.id].colors.Color2 : colors.cosmetics[item.id].colors.Color1 }} // Added style for the image
                                            //             source={getRarityPath(item.id)}
                                            //         />
                                            //         <Text
                                            //             style={{
                                            //                 color: colors.cosmetics[item.id].colors.Color1,
                                            //                 textAlign: 'center',
                                            //                 marginRight: 20,
                                            //                 fontSize: 17,
                                            //                 fontFamily: "BurbankSmall-Black"
                                            //             }}
                                            //         >
                                            //             {item.name.toUpperCase()}
                                            //         </Text>
                                            //     </RNGHTouchableOpacity>
                                            // </View>

                                            <View key={index}>
                                                <RNGHTouchableOpacity
                                                    style={{
                                                        marginRight: 5,
                                                        height: 60,
                                                        borderRadius: 10,
                                                        alignItems: 'center',
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',

                                                    }}
                                                    onPress={() => handleRarityButtonClick(item.id)} // Handle button click
                                                >
                                                    <Image
                                                        style={{ flex: 1, width: 'auto', height: 60, borderWidth: 2, contentFit: 'cover', paddingHorizontal: 25, borderRadius: 10, borderColor: filterQuery.rarity.includes(item.id) ? colors.cosmetics[item.id].colors.Color2 : colors.cosmetics[item.id].colors.Color1 }} // Added style for the image
                                                        source={getRarityPath(item.id)}
                                                    />

                                                </RNGHTouchableOpacity>
                                            </View>

                                        ))

                                    }
                                </View>
                            </ScrollView>
                        </View>

                        <View style={{
                            flex: 1,
                            marginTop: 10,
                        }}>
                            <Text style={{
                                color: 'white',
                                fontSize: 18,
                                paddingHorizontal: 20,
                                fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                            }}>{t("source").toUpperCase()}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: i18next.language === "ar" ? null : 10,
                                    width: '100%',
                                }}>
                                    {
                                        cosmeticSources.map((item, index) => (
                                            <View key={index}>
                                                <RNGHTouchableOpacity
                                                    style={{
                                                        marginRight: 5,
                                                        height: 60,
                                                        borderRadius: 10,
                                                        padding: 5,
                                                        backgroundColor: "#222128",
                                                        alignItems: 'center',
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        borderWidth: filterQuery.source.find(source => source === item.id) ? 2 : null,
                                                        borderColor: filterQuery.source.find(source => source === item.id) ? colors.app.buttons : null
                                                    }}
                                                    onPress={() => handleSourceButtonClick(item.id)} // Handle button click
                                                >
                                                    <LinearGradient colors={item.colors} style={{
                                                        padding: 10,
                                                        borderRadius: 10,
                                                        marginRight: 5,
                                                    }}>
                                                        {
                                                            item.type === "image" ? (
                                                                <Image
                                                                    style={{ width: 30, height: 30 }}
                                                                    source={item.path}
                                                                    contentFit='contain'
                                                                />
                                                            ) : item.type === "emoji" ? (
                                                                <Text
                                                                    style={{
                                                                        textAlign: 'center',
                                                                        fontSize: 25,
                                                                        color: "white",
                                                                        fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                                                    }}
                                                                >
                                                                    {item.emoji}
                                                                </Text>
                                                            ) : null
                                                        }

                                                    </LinearGradient>
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            marginRight: 20,
                                                            fontSize: 17,
                                                            color: "white",
                                                            fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                                        }}
                                                    >
                                                        {item.name.toUpperCase()}
                                                    </Text>
                                                </RNGHTouchableOpacity>
                                            </View>

                                        ))

                                    }
                                </View>
                            </ScrollView>
                        </View>

                        <View style={{
                            flex: 1,
                            marginTop: 10,
                        }}>
                            <Text style={{
                                color: 'white',
                                fontSize: 18,
                                paddingHorizontal: 20,
                                fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                            }}>{t("tag").toUpperCase()}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: i18next.language === "ar" ? null : 10,
                                    width: '100%',
                                }}>
                                    {
                                        cosmeticTags.map((item, index) => (
                                            <View key={index}>
                                                <RNGHTouchableOpacity
                                                    style={{
                                                        marginRight: 5,
                                                        height: 60,
                                                        borderRadius: 10,
                                                        padding: 5,
                                                        backgroundColor: "#222128",
                                                        alignItems: 'center',
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        borderWidth: filterQuery.tags.find(source => source === item.id) ? 2 : null,
                                                        borderColor: filterQuery.tags.find(source => source === item.id) ? colors.app.buttons : null
                                                    }}
                                                    onPress={() => handleTagsButtonClick(item.id)}
                                                >
                                                    <View style={{
                                                        padding: 10,
                                                        borderRadius: 10,
                                                        backgroundColor: '#424448',
                                                        marginRight: 5
                                                    }}>
                                                        <Image
                                                            style={{ width: 30, height: 30 }}
                                                            source={getTagsPath(item.id)}
                                                            contentFit='contain'
                                                        />
                                                    </View>
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            marginRight: 20,
                                                            fontSize: 17,
                                                            color: "white",
                                                            fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                                        }}
                                                    >
                                                        {item.name.toUpperCase()}
                                                    </Text>
                                                </RNGHTouchableOpacity>
                                            </View>

                                        ))

                                    }
                                </View>
                            </ScrollView>
                        </View>

                        <View style={{
                            flex: 1,
                            marginTop: 10,
                        }}>
                            <Text style={{
                                color: 'white',
                                fontSize: 18,
                                paddingHorizontal: 20,
                                fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                            }}>{t("season").toUpperCase()}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: i18next.language === "ar" ? null : 10,
                                    width: '100%',
                                }}>
                                    {
                                        cosmeticChapters.map((chapter, index) => (
                                            <View key={index}>
                                                <RNGHTouchableOpacity
                                                    style={{
                                                        marginRight: 5,
                                                        height: 60,
                                                        borderRadius: 10,
                                                        padding: 5,
                                                        backgroundColor: "#222128",
                                                        alignItems: 'center',
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        borderWidth: filterQuery.chapters.find(cs => cs === chapter.displayName) ? 2 : null,
                                                        borderColor: filterQuery.chapters.find(cs => cs === chapter.displayName) ? colors.app.buttons : null,
                                                    }}
                                                    onPress={() => handleChaptersButtonClick(chapter.displayName)}
                                                >
                                                    <Image
                                                        style={{
                                                            width: 50, height: 50, borderRadius: 10, marginRight: 5
                                                        }}
                                                        source={chapter.path}
                                                        contentFit='contain'
                                                    />
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            marginRight: 20,
                                                            fontSize: 17,
                                                            color: "white",
                                                            fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                                        }}
                                                    >
                                                        {chapter.displayName.toUpperCase()}
                                                    </Text>
                                                </RNGHTouchableOpacity>
                                            </View>
                                        ))

                                    }
                                </View>
                            </ScrollView>
                        </View>

                        <View style={{
                            marginTop: 10,
                            paddingHorizontal: 20,
                        }}>
                            <View style={{
                                marginBottom: 10
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 18,
                                    marginBottom: i18next.language === "ar" ? null : 10,
                                    fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                }}>{t("sort").toUpperCase()}</Text>

                                <View>

                                    <View style={{
                                        flexDirection: 'row',
                                        marginBottom: 5
                                    }}>
                                        <RNGHTouchableOpacity onPress={sortNewestFirst} style={{
                                            marginRight: 5,
                                            height: 60,
                                            borderRadius: 10,
                                            padding: 5,
                                            backgroundColor: '#222128',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            width: 170,
                                            borderWidth: sortType === "nf" ? 2 : null,
                                            borderColor: sortType === "nf" ? colors.app.buttons : null,
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 18,
                                                fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                            }}>{t("newest_first").toUpperCase()}</Text>
                                        </RNGHTouchableOpacity>

                                        <RNGHTouchableOpacity onPress={sortOldestFirst} style={{
                                            marginRight: 5,
                                            height: 60,
                                            borderRadius: 10,
                                            padding: 5,
                                            backgroundColor: '#222128',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            width: 170,
                                            borderWidth: sortType === "of" ? 2 : null,
                                            borderColor: sortType === "of" ? colors.app.buttons : null,
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 18,
                                                fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                            }}>{t("oldest_first").toUpperCase()}</Text>
                                        </RNGHTouchableOpacity>
                                    </View>

                                    <View style={{
                                        flexDirection: 'row',
                                        marginBottom: 5
                                    }}>
                                        <RNGHTouchableOpacity onPress={sortShopRecent} style={{
                                            marginRight: 5,
                                            height: 60,
                                            borderRadius: 10,
                                            padding: 5,
                                            backgroundColor: '#222128',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            width: 170,
                                            borderWidth: sortType === "sr" ? 2 : null,
                                            borderColor: sortType === "sr" ? colors.app.buttons : null,
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 18,
                                                fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                            }}>{t("shop_recent").toUpperCase()}</Text>
                                        </RNGHTouchableOpacity>

                                        <RNGHTouchableOpacity onPress={sortShopLongest} style={{
                                            marginRight: 5,
                                            height: 60,
                                            borderRadius: 10,
                                            padding: 5,
                                            backgroundColor: '#222128',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            width: 170,
                                            borderWidth: sortType === "sl" ? 2 : null,
                                            borderColor: sortType === "sl" ? colors.app.buttons : null,
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 18,
                                                fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                            }}>{t("shop_longest").toUpperCase()}</Text>
                                        </RNGHTouchableOpacity>
                                    </View>

                                    <View style={{
                                        flexDirection: 'row',
                                        marginBottom: 5
                                    }}>
                                        <RNGHTouchableOpacity onPress={sortATOZ} style={{
                                            marginRight: 5,
                                            height: 60,
                                            borderRadius: 10,
                                            padding: 5,
                                            backgroundColor: '#222128',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            width: 170,
                                            borderWidth: sortType === "az" ? 2 : null,
                                            borderColor: sortType === "az" ? colors.app.buttons : null,
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 18,
                                                fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                            }}>{t("atoz").toUpperCase()}</Text>
                                        </RNGHTouchableOpacity>

                                        <RNGHTouchableOpacity onPress={sortZTOA} style={{
                                            marginRight: 5,
                                            height: 60,
                                            borderRadius: 10,
                                            padding: 5,
                                            backgroundColor: '#222128',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            width: 170,
                                            borderWidth: sortType === "za" ? 2 : null,
                                            borderColor: sortType === "za" ? colors.app.buttons : null,
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 18,
                                                fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                            }}>{t("ztoa").toUpperCase()}</Text>
                                        </RNGHTouchableOpacity>
                                    </View>

                                </View>
                            </View>

                            <RNGHTouchableOpacity onPress={resetFilters} style={{
                                paddingHorizontal: 20,
                                paddingVertical: 15,
                                backgroundColor: colors.app.buttons,
                                borderRadius: 10
                            }}>
                                <Text style={{
                                    fontSize: 20,
                                    textAlign: 'center',
                                    color: 'white',
                                    fontFamily: i18next.language === "ar" ? "Lalezar-Regular" : "BurbankSmall-Black",
                                }}>{t("reset_filters").toUpperCase()}</Text>
                            </RNGHTouchableOpacity>
                        </View>
                    </View>

                </BottomSheet>
            </Portal>

        </LinearGradient>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
});