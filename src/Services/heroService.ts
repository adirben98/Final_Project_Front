import { apiClient } from "./useAuth";
export interface IHero{
    name: string;
    image: string;
}

class heroService{
    getHeroes(){
        const controller = new AbortController();
        const getHeroes= apiClient.get<IHero[]>("/hero",{
            signal: controller.signal
        })
        return {getHeroes, cancelHeroes:()=>controller.abort()}
    }
    
}
export default new heroService();