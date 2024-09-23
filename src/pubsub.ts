import { ColorEvent, Tile } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions-continued';

export const COLOR_EVENT = 'TILE_COLORED'

export type ColorEventPayload = {
  colorEvent: ColorEvent & {tile: Pick<Tile, 'boardId'>}
}

export const pubsub = new PubSub();