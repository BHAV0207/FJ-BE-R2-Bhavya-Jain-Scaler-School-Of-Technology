--------------------------------------------------
-- MULTI CURRENCY SUPPORT
--------------------------------------------------

ALTER TABLE transactions

ADD COLUMN exchange_rate NUMERIC(18,6)
NOT NULL
DEFAULT 1;

ALTER TABLE transactions

ADD COLUMN base_amount NUMERIC(15,2)
NOT NULL
DEFAULT 0;

--------------------------------------------------
-- BACKFILL EXISTING DATA
--------------------------------------------------

UPDATE transactions

SET

exchange_rate = 1,

base_amount = amount

WHERE currency = 'INR';

--------------------------------------------------
-- INDEX
--------------------------------------------------

CREATE INDEX idx_transactions_base_amount
ON transactions(base_amount);