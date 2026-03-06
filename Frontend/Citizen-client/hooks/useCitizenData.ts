import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCitizenData } from '../store/slices/citizenSlice';

const useCitizenData = (citizenId) => {
    const dispatch = useDispatch();
    const citizenData = useSelector((state) => state.citizen.data);
    const loading = useSelector((state) => state.citizen.loading);
    const error = useSelector((state) => state.citizen.error);

    useEffect(() => {
        if (citizenId) {
            dispatch(fetchCitizenData(citizenId));
        }
    }, [citizenId, dispatch]);

    return { citizenData, loading, error };
};

export default useCitizenData;