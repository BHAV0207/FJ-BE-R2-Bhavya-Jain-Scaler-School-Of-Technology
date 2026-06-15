--------------------------------------------------
-- CATEGORY SOFT DELETE SUPPORT
--------------------------------------------------

ALTER TABLE categories
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
