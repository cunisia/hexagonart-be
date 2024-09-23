import { withFilter } from "graphql-subscriptions-continued";
import { COLOR_EVENT, ColorEventPayload, pubsub } from "./pubsub";
import { colorTile } from "./services/colorTile";
import { createBoard } from "./services/createBoard";
import { deleteBoard } from "./services/deleteBoard";
import { Resolvers, SubscriptionColorEventArgs } from "./types";

export const resolvers: Resolvers = {
  Query: {
    board: (_, args, { dataSources }) => {
      return dataSources.prisma.board.findUniqueOrThrow({
        where: {id: args.id}, 
      });
    },
    tile: (_, args, { dataSources }) => {
      return dataSources.prisma.tile.findUniqueOrThrow({
        where: {id: args.id}, 
      });
    }
  },
  Board: {
    tiles: ({id}, _, {dataSources}) => {
      return dataSources.prisma.tile.findMany({
        where: {boardId: id}
      })
    },
    author: ({ authorId }, _, {dataSources}) => {
      return dataSources.prisma.user.findUniqueOrThrow({
        where: {id: authorId}
      })
    },
  },
  Tile: {
    lastColorTileEvent: ({id}, _, {dataSources}) => {
      return dataSources.prisma.colorEvent.findFirstOrThrow({
        where: {tileId: id},
        orderBy: {id: 'desc'}
      })
    },
    colorEvents: ({id}, _, {dataSources}) => {
      return dataSources.prisma.colorEvent.findMany({
        where: {tileId: id},
        orderBy: {id: 'desc'}
      })
    },
  },
  ColorEvent: {
    user: ({userId}, _, {dataSources}) => {
      return dataSources.prisma.user.findUniqueOrThrow({
        where: {id: userId},
      })
    },
  },
  Mutation: {
    createBoard: async (_, { input }, ctx) => {
      return createBoard(ctx, input)
    },
    colorTile: async (_, { input }, ctx) => {
      return colorTile(ctx, input)
    },
    deleteBoard: async (_, { input }, ctx) => {
      return deleteBoard(ctx, input)
    }, 
  },
  Subscription: {
    colorEvent: {
      subscribe: withFilter(
        () => pubsub.asyncIterator<ColorEventPayload>(COLOR_EVENT),
        (payload: ColorEventPayload, variables: SubscriptionColorEventArgs) => payload.colorEvent.tile.boardId === variables.boardId
      )
    }
  }
}