import API from './API';

const DataService = {
    fetchDISCData: (disc_character) => {
        return API.get(`/profiles/disc-data/${disc_character}`)
            .then((response) => response.data)
            .catch((error) => {
                console.error('업무 설명을 불러오는 동안 오류가 발생했습니다.', error);
                throw error;
            });
    },
};
