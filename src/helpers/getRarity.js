export default function getRarityPath(rarity) {
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
}