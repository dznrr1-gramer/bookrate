-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "Author_name_idx" ON "Author"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Book_slug_key" ON "Book"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "Book_googleBooksVolumeId_key" ON "Book"("googleBooksVolumeId");

-- CreateIndex
CREATE INDEX "Book_title_idx" ON "Book"("title");

-- CreateIndex
CREATE INDEX "Book_publisherId_idx" ON "Book"("publisherId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Favorite_bookId_idx" ON "Favorite"("bookId");

-- CreateIndex
CREATE INDEX "Favorite_userId_createdAt_idx" ON "Favorite"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_bookId_key" ON "Favorite"("userId", "bookId");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");

-- CreateIndex
CREATE INDEX "Genre_name_idx" ON "Genre"("name");

-- CreateIndex
CREATE INDEX "Publisher_name_idx" ON "Publisher"("name");

-- CreateIndex
CREATE INDEX "ReadingList_bookId_idx" ON "ReadingList"("bookId");

-- CreateIndex
CREATE INDEX "ReadingList_userId_status_idx" ON "ReadingList"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingList_userId_bookId_key" ON "ReadingList"("userId", "bookId");

-- CreateIndex
CREATE INDEX "Review_bookId_createdAt_idx" ON "Review"("bookId", "createdAt");

-- CreateIndex
CREATE INDEX "Review_bookId_rating_idx" ON "Review"("bookId", "rating");

-- CreateIndex
CREATE INDEX "Review_userId_createdAt_idx" ON "Review"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_bookId_key" ON "Review"("userId", "bookId");

-- CreateIndex
CREATE INDEX "ReviewLike_reviewId_idx" ON "ReviewLike"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewLike_userId_reviewId_key" ON "ReviewLike"("userId", "reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
