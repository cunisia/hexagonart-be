import { randomIntFromInterval } from "../utils";
import { DataSourceContext } from "../context";
import { CreateBoardInput, CreateBoardResponse, ResolversTypes, Tile } from "../types";
import type { ColorEvent, Prisma } from "@prisma/client"; 
import { ROOT_ID, BOARD_HEIGHT, BOARD_WIDTH } from "../const";

export const createBoard = async ({dataSources}: DataSourceContext, input: CreateBoardInput): Promise<ResolversTypes['CreateBoardResponse']> => {
  // Generating colors out of transaction in order to save some time
  const randomColors: Pick<ColorEvent, 'r' | 'g' | 'b'>[] = Array(BOARD_HEIGHT * BOARD_WIDTH).fill(undefined).map(_ => ({
    r: randomIntFromInterval(0, 255),
    g: randomIntFromInterval(0, 255),
    b: randomIntFromInterval(0, 255)
  }))
  const startTime = (new Date()).getTime()

  try {
    const createdBoard = await dataSources.prisma.$transaction(async (prisma) => {
      const board = await prisma.board.create({
        data: {
          name: input.name,
          authorId: ROOT_ID,
        }
      })

      console.log(`---> done creating board in ${(new Date()).getTime() - startTime}`)

      const { id: boardId } = board 
      const tileInputs: Prisma.TileCreateManyInput[] = []
      for (let row = 0; row < BOARD_HEIGHT; row ++) {
        const a = row % 2
        const r = Math.floor(row / 2)
        for (let c = 0; c < BOARD_WIDTH; c++) {
          tileInputs.push({
            boardId,
            a,
            r,
            c
          })
        }
      }
      
      await prisma.tile.createMany({
        data: tileInputs,
      })

      console.log(`---> done creating tiles in ${(new Date()).getTime() - startTime}`)

      const tiles = await prisma.tile.findMany({
        where:  {
          boardId
        },
        select: {
          id: true
        }
      })

      const colorEventInputs: Prisma.ColorEventCreateManyInput[] = tiles.map(({id}, i) => ({
        tileId: id,
        userId: ROOT_ID,
        ...randomColors[i]
      }))

      await prisma.colorEvent.createMany({
        data: colorEventInputs
      })

      console.log(`---> done creating colorEvents in ${(new Date()).getTime() - startTime}`)

      return board
    })

    return {
      success: true,
      message: 'OK',
      board:  createdBoard
    }

  } catch (err) {
    console.error('Error while creating board', err)
    return {
      success: false,
      message: err.message,
      board: null
    }
  }
}