import { DataSourceContext } from "../context";
import { ResolversTypes } from "../types";
import { DeleteBoardInput } from "../types";

export const deleteBoard = async ({dataSources}: DataSourceContext, input: DeleteBoardInput): Promise<ResolversTypes['DeleteBoardResponse']> => {
  try {
    await dataSources.prisma.$transaction(async (prisma) => {
      const boardId = input.id;
      prisma.colorEvent.deleteMany({where: {
        tile: {
          boardId
        }
      }})
      prisma.tile.deleteMany({where: {
        boardId
      }})
      prisma.board.delete({where: {id: boardId}})
    })
    return {
      success: true,
      message: 'OK',
      id: input.id
    }
  } catch (err) {
    console.error(`Error while deleting board ${input.id}`, err)
    return {
      success: false,
      message: err.message,
      id: input.id
    }
  }
}