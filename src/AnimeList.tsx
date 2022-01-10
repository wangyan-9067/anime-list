import React, { FC, useMemo } from "react";
import styled from 'styled-components';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { useApi } from './ApiContext';

const StyledList = styled(List)`
    height: calc(100vh - 10rem);
    overflow-y: scroll;
`;

const StyledListItem = styled(ListItemButton)`
    &:nth-child(odd) {
        background-color: ${params => params.theme.colors.gray};
    }

    &.selected {
        background-color: ${params => params.theme.colors.green};
    }
`;

export const AnimeList: FC = () => {
    const { animes, selectedAnime, setAnime } = useApi();

    return useMemo(() => {
        if (!animes || animes.length === 0) {
            return (
                <></>
            )
        }

        const clickHandler = (name: string) => () => {
            setAnime(name);
        }

        return (
            <StyledList>
                {animes.map(anime => (
                    <StyledListItem className={selectedAnime === anime? 'selected' : ''} key={anime} onClick={clickHandler(anime)}>{anime}</StyledListItem>
                ))}
            </StyledList>
        )
    }, [animes, selectedAnime]);
}

