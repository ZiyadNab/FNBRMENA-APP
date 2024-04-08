export default function getImagePath(type){
    const typeLower = type.toLowerCase();
    switch (typeLower) {
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