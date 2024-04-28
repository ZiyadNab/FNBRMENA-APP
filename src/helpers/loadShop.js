import React, { memo, useCallback, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import AutoScrollingScrollView from './imageSlider'
import { LinearGradient } from 'expo-linear-gradient';

const loadShop = ({ item, index, navigation }) => {
    
    return (
        <View key={index} style={{
            marginBottom: 15,
        }}>
            <View style={{
                paddingHorizontal: 20,
                width: 'auto',
                flexDirection: "row",
                marginBottom: 5
            }}>
                <Text style={{ color: "white", fontFamily: "BurbankBigCondensed-Black", fontSize: 20, marginRight: 5 }}>{item.name.toUpperCase()}</Text>
                <View style={{
                    backgroundColor: "#009BFF",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 5,
                    borderRadius: 5
                }}>
                    <Text style={{ color: "white", fontFamily: "BurbankBigCondensed-Black", fontSize: 15 }}>{item.itemsCount} ITEMS</Text>
                </View>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
                {item.tiles.map((ratio, index) => (
                    <View key={index} style={{ flexDirection: 'row' }}>
                        {
                            ratio.tileSize === "Size_1_x_1" ? (
                                <View style={{ flexDirection: 'row' }}>
                                    {[...Array(Math.ceil(ratio.list.length / 2))].map((_, colIndex) => (
                                        <View key={colIndex} style={{ flexDirection: 'column' }}>
                                            {/* Map through the items in each column */}
                                            {ratio.list.slice(colIndex * 2, colIndex * 2 + 2).map((offer, rowIndex) => (
                                                <TouchableOpacity onPress={() => navigation.navigate("DetailsScreen", { data: offer.granted[0] })} key={`${colIndex}-${rowIndex}`} style={{
                                                    // borderRadius: 5,
                                                    marginRight: 5,
                                                    marginBottom: rowIndex === 0 ? 5 : 0, // Add margin bottom for the first item in each column
                                                    width: 72,
                                                    height: 72,
                                                    overflow: 'hidden',
                                                    backgroundColor: '#191919',
                                                    position: "relative"
                                                }}>
                                                    <AutoScrollingScrollView
                                                        width={72}
                                                        height={72}
                                                        images={offer.displayAssets.map(e => e.background + "?width=125")}
                                                    />
                                                    <LinearGradient
                                                        colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            height: 30, // Adjust the height of the shadow as needed
                                                        }}
                                                    />
                                                    <Text style={{
                                                        fontSize: 10,
                                                        color: "white",
                                                        position: "absolute",
                                                        bottom: 13,
                                                        left: 3,
                                                        fontFamily: "BurbankSmall-Black"
                                                    }}>{offer.displayName.toUpperCase()}</Text>
                                                    <Image style={{
                                                        position: "absolute",
                                                        bottom: 3,
                                                        left: 3,
                                                        width: 11,
                                                        height: 11
                                                    }} source={require("../../assets/cosmetics/others/vbucks.png")} />
                                                    <Text style={{
                                                        fontSize: 9,
                                                        color: "white",
                                                        position: "absolute",
                                                        bottom: 3,
                                                        left: 14,
                                                        fontFamily: "BurbankSmall-Black"
                                                    }}>{offer.price.finalPrice}</Text>

                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <View style={{ flexDirection: "row" }}>
                                    {ratio.list.map((offer, rowIndex) => (
                                        <TouchableOpacity key={rowIndex} onPress={() => navigation.navigate("DetailsScreen", { data: offer.granted[0] })}>
                                            <View style={{
                                                // borderRadius: 5,
                                                marginRight: 5,
                                                width: offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 170 : offer.tileSize === "Size_2_x_2" ? 150 : offer.tileSize === "Size_1_x_2" ? 82 : 150,
                                                height: offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 150 : offer.tileSize === "Size_2_x_2" ? 150 : offer.tileSize === "Size_1_x_2" ? 150 : 150,
                                                overflow: 'hidden',
                                                backgroundColor: '#191919',
                                                position: "relative", // Add position relative to the outer View
                                            }}>

                                                <AutoScrollingScrollView
                                                    width={offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 170 : offer.tileSize === "Size_2_x_2" ? 150 : offer.tileSize === "Size_1_x_2" ? 82 : 150}
                                                    height={offer.tileSize === "Size_3_x_2" || offer.tileSize === "TripleWide" ? 150 : offer.tileSize === "Size_2_x_2" ? 150 : offer.tileSize === "Size_1_x_2" ? 150 : 150}
                                                    images={offer.displayAssets.map(e => e.background + "?width=265")}
                                                />
                                                <LinearGradient
                                                    colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: -2,
                                                        left: 0,
                                                        right: 0,
                                                        height: 75, // Adjust the height of the shadow as needed
                                                    }}
                                                />
                                                <Text style={{
                                                    fontSize: 12,
                                                    color: "white",
                                                    position: "absolute",
                                                    bottom: 15,
                                                    left: 3,
                                                    fontFamily: "BurbankSmall-Black"
                                                }}>{offer.displayName.toUpperCase()}</Text>
                                                <Image style={{
                                                    position: "absolute",
                                                    bottom: 3,
                                                    left: 3,
                                                    width: 12,
                                                    height: 12
                                                }} source={require("../../assets/cosmetics/others/vbucks.png")} />
                                                <Text style={{
                                                    fontSize: 12,
                                                    color: "white",
                                                    position: "absolute",
                                                    bottom: 2,
                                                    left: 15,
                                                    fontFamily: "BurbankSmall-Black"
                                                }}>{offer.price.finalPrice}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )
                        }
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default memo(loadShop)