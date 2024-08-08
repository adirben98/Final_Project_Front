import { apiClient } from "./useAuth";

class heroService{
    getHeroes(){
        const controller = new AbortController();
        const heroes= apiClient.get("/hero",{
            signal: controller.signal
        })
        return {heroes, cancelHeroes:()=>controller.abort()}
    }
    
}
export default new heroService();