-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
alter table listings
  add column if not exists bedrooms             integer,
  add column if not exists bathrooms            integer,
  add column if not exists floor_area           numeric,
  add column if not exists lot_area             numeric,
  add column if not exists property_type        text,
  add column if not exists region               text,
  add column if not exists features             text[] default '{}',
  add column if not exists status               text,
  add column if not exists monthly_amortization text,
  add column if not exists pagibig_eligible     boolean default true;
