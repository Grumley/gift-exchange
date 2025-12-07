import { characterList } from '@/assets/characters';

// Deterministic character selection
export function getFestiveCharacter(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % characterList.length;
    return characterList[index];
}
