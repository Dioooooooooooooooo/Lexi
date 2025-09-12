import { Minigame } from '@/models/Minigame';
import { axiosInstance } from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

const getRandomMinigames = async (readingMaterialID: string) => {
  try {
    const response = await axiosInstance.get(
      `/minigames/readingmaterials/${readingMaterialID}/random`,
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data.message);
    }

    console.log('MINIGAMES!!', response.data);
    return response.data.data;
  } catch (err: any) {
    console.error('Failed fetching random minigames:', err);
    throw new Error('Failed fetching random minigames:', err);
  }
};

export const useGetRandomMinigames = (readingMaterialID: string) => {
  return useQuery<Minigame[]>({
    queryKey: ['minigame', readingMaterialID],
    queryFn: () => getRandomMinigames(readingMaterialID),
    enabled: !!readingMaterialID,
  });
};
