import { between } from "../utils"
import { DataSourceContext } from "../context"
import { ColorTileInput, ColorTileResponse, ResolversTypes } from "../types"
import {ROOT_ID} from "../const"
import { pubsub, COLOR_EVENT } from "../pubsub"

export const colorTile = async ({dataSources}: DataSourceContext, input: ColorTileInput): Promise<ResolversTypes['ColorTileResponse']> => {
  const {tileId, r, g, b} = input

  if ([r, g, b].some(v => !between(v, 0, 255))) {
    return {
      success: false,
      message: 'Color values must be between 0 and 255',
      colorEvent: null
    }
  }

  if ([r, g, b].some(v => !Number.isInteger(v))) {
    return {
      success: false,
      message: 'Color values must be integers',
      colorEvent: null
    }
  }

  try {
    const colorEvent = await dataSources.prisma.colorEvent.create({
      data: {
        tile: {connect: {id: tileId}},
        user: {connect: {id: ROOT_ID}},
        r: input.r,
        g: input.g,
        b: input.b
      }, 
      include: {
        tile: {
          select: {
            boardId: true
          }
        }
      }
    })

    pubsub.publish(COLOR_EVENT, {
      colorEvent: {
        ...colorEvent
      },
    });
  
    return {
      success: true,
      message: 'OK',
      colorEvent
    }
  } catch (err) {
    console.error('Error while creating colorEvent', err)
    return {
      success: false,
      message: err.message,
      colorEvent: null
    }
  }
}