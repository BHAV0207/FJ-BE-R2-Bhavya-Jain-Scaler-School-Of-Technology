--------------------------------------------------
-- USER PREFERRED CURRENCY SUPPORT
--------------------------------------------------

ALTER TABLE users
ADD COLUMN preferred_currency CHAR(3) 
NOT NULL 
DEFAULT 'INR'
CHECK(length(preferred_currency)=3)
CHECK(preferred_currency = UPPER(preferred_currency));
