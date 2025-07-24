"use server"

import { db } from "@/lib/prisma"

export async function RoomExist(roomid) {
  try {
    const room = await db.room.findUnique({
      where:{id:roomid}
    })

    if (!room) {
      return(false)
    }

    return (true)
  } catch (error) {
    throw new Error("INVALID ")
  }
}


export async function userData(roomid) {
  try {
    const room = await db.room.findUnique({
      where: { id: roomid},
      include: {
        users: {
        },
      },
    });
  
    if (!room) {
      throw new Error("ROOM NOT FOUND")
    }

    return room 

  } catch (error) {
    console.log("userData Error:",error)
    throw new Error("INVALID")
  }
}