-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "time" INTEGER DEFAULT 100,
    "rounds" INTEGER DEFAULT 3,
    "maxPlayer" INTEGER DEFAULT 8,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "host" BOOLEAN NOT NULL DEFAULT false,
    "roomId" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
