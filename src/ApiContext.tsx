import React, { ReactNode, FC, useEffect, useCallback, useState, useContext, useRef } from "react";
import toast from 'react-hot-toast';
import { Notification } from './Notification';

interface IApiContextProps {
    children: ReactNode;
}

interface IApiContextState {
    loading: boolean;
    animes: string[];
    selectedAnime: string;
    setAnime: (val: string) => void;
    quotes: IQuote[];
    quotesEnd: boolean;
    loadPage: () => void;
}

interface IPagedRequests {
    name: string;
    pageIndex: number;
    pageEnd: boolean;
    data: {[key in number]: IQuote[]}
}

export interface IQuote {
    anime: string;
    character: string;
    quote: string;
}

const BASE_URL = 'https://animechan.vercel.app/api';

async function _httpRequest(url: string) {
    const response: Response = await fetch(`${BASE_URL}/${url}`);

    if (response.ok) {
        return await response.json();
    }

    throw new Error(`http request fail with code ${response.status}`);
}

export const ApiContext = React.createContext<IApiContextState>({} as IApiContextState);

export function useApi(): IApiContextState {
    return useContext(ApiContext);
}

export const ApiContextProvider: FC<IApiContextProps> = ({
    children
}) => {
    const [animes, setAnimes] = useState<string[]>([]);
    const [selectedAnime, setSelectedAnime] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [quotes, setQuotes] = useState<IQuote[]>([]);
    const [quotesEnd, setQuotesEnd] = useState(false);
    const pagedRequests = useRef<IPagedRequests>({
        name: '',
        pageIndex: 0,
        pageEnd: false,
        data: {}
    });

    const loadPage = useCallback(async () => {
        if (pagedRequests.current.pageEnd || !pagedRequests.current.name) {
            return;
        }

        console.log('loadPage');
        try {
            let pageIndex = ++pagedRequests.current.pageIndex;
            let response = await _httpRequest(`quotes/anime?title=${pagedRequests.current.name}&page=${pageIndex}`);

            if (!response || !response[0] || response[0].anime !== pagedRequests.current.name) {
                // no response || response return too late, anime tag already changed
                return;
            }

            if (response.length < 10) {
                pagedRequests.current.pageEnd = true;
            }

            pagedRequests.current.data[pageIndex] = response;

            let data: IQuote[] = [];

            for (let key in pagedRequests.current.data) {
                data = data.concat(pagedRequests.current.data[key]);
            }

            setQuotes(data);
            setQuotesEnd(pagedRequests.current.pageEnd);
        } catch(e) {
            // TODO: display error message on UI
            console.error(e);
            pagedRequests.current.pageEnd = true;
            setQuotes([]);
            setQuotesEnd(true);
            toast.custom(
                <Notification
                    message={`Failed to fetch anime ${pagedRequests.current.name}`}
                    variant='error'
                />
            )

        }
    }, [pagedRequests, setQuotes]);

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                let response = await _httpRequest('available/anime');

                setAnimes(response);
                setAnime(response[0]);
                setLoading(false);
            } catch(e) {
                // TODO: display error message on UI
                console.error(e);
                setLoading(false);
                toast.custom(
                    <Notification
                        message={`Failed to fetch animes`}
                        variant='error'
                    />
                )
            }
        };

        init();
    }, []);

    const setAnime = useCallback((name: string) => {
        if (name === selectedAnime) {
            return;
        }

        setSelectedAnime(name);
        setQuotes([]);
        setQuotesEnd(false);
        pagedRequests.current = {
            name: name,
            pageIndex: 0,
            pageEnd: false,
            data: {}
        };
        loadPage();

    }, [selectedAnime, loadPage]);

    return (
        <ApiContext.Provider value={{
            loading,
            animes,
            selectedAnime,
            setAnime,
            quotes,
            quotesEnd,
            loadPage
        }}>
            {children}
        </ApiContext.Provider>
    )
}