import React, { FC, useEffect, useMemo, useRef } from "react";
import Grid from '@mui/material/Grid';
import styled from 'styled-components';
import { useApi } from './ApiContext';
import CircularProgress from '@mui/material/CircularProgress';
import { debounce } from './utils';

const StyledDetails = styled(Grid)`
    & .MuiGrid-item:nth-child(4n+2) {
        background-color: ${params => params.theme.colors.gray};
    }

    & .MuiGrid-item:nth-child(4n+3) {
        background-color: ${params => params.theme.colors.gray};
    }

    & .MuiGrid-item {
        padding: 1rem;
    }
`;

const Quote = styled.div`
`;

const StyledCircularProgress = styled(CircularProgress)`
    padding: 2rem 0;
`;

export const Details: FC = () => {
    const { quotes, quotesEnd, loadPage } = useApi();
    const loadingRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const scrollHandler = () => {
            if (!loadingRef.current) {
                return;
            }

            if (loadingRef.current.offsetTop < window.innerHeight + window.scrollY) {
                debounce(loadPage)();
            }
        };

        const resizeHandler = () => {
            debounce(scrollHandler)();
        }

        debounce(scrollHandler, 100)();

        document.addEventListener('scroll', scrollHandler);
        window.addEventListener('resize', resizeHandler);

        return () => {
            document.removeEventListener('scroll', scrollHandler);
            window.removeEventListener('resize', resizeHandler);
        }
    }, [loadingRef, loadPage, quotes]);

    return useMemo(() => {
        if (!quotes || quotes.length === 0) {
            return quotesEnd ? (<></>) : (<StyledCircularProgress id="loading" ref={loadingRef}/>);
        }

        return (
            <div>
                <StyledDetails container spacing={4}>
                    {quotes.map((quote, index) => (
                        <Grid item xs={6} key={`${quote.character}-${index}`}>
                            <Quote>
                                <p><b>Character: {quote.character}</b></p>
                                <em>{quote.quote}</em>
                            </Quote>
                        </Grid>
                    ))}
                </StyledDetails>
                { quotesEnd ? (<></>): (<StyledCircularProgress id="loading" ref={loadingRef}/>)}
            </div>
        )
    }, [quotes, quotesEnd]);
};