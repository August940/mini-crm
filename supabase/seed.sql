-- seed.sql — realistiske demo-leads, så et nyt Supabase-projekt ser levende ud.
-- Spejler src/lib/data/seed.ts. Kør efter migrationen (kun på en tom tabel).

insert into public.leads (name, company, email, deal_value, stage, notes, created_at, updated_at)
values
  ('Mette Sørensen',   'Nordisk Byg A/S',     'mette@nordiskbyg.dk',        120000, 'lead',         'Kom ind via kontaktformular. Vil høre om abonnement til 15 brugere.', now() - interval '2 days',  now() - interval '2 days'),
  ('Lars Holm',        'Holm Consulting',     'lars@holmconsulting.dk',      85000, 'kontaktet',    'Ringede tirsdag. Sender mere info om priser. Følg op om en uge.',     now() - interval '6 days',  now() - interval '6 days'),
  ('Sofie Lund',       'Lund Design',         'sofie@lunddesign.dk',        240000, 'tilbud_sendt', 'Tilbud sendt 12/6. Afventer svar fra deres ledelse.',                 now() - interval '11 days', now() - interval '11 days'),
  ('Anders Kjær',      'Kjær Logistik',       'anders@kjaerlogistik.dk',    450000, 'kontrakt',     'Kontrakt under review hos deres jurist. Forventet underskrift næste uge.', now() - interval '19 days', now() - interval '19 days'),
  ('Camilla Berg',     'BergTech ApS',        'camilla@bergtech.dk',        180000, 'aktiv',        'Onboardet og kører. Meget tilfreds. Mulighed for udvidelse i Q4.',    now() - interval '34 days', now() - interval '34 days'),
  ('Jonas Dahl',       'Dahl Marketing',      'jonas@dahlmarketing.dk',      60000, 'lead',         'Hentede whitepaper. Lille team, men vokser hurtigt.',                 now() - interval '1 days',  now() - interval '1 days'),
  ('Pernille Vinther', 'Vinther & Co',        'pernille@vintherco.dk',       95000, 'kontaktet',    'Booket demo til fredag kl. 10. Interesseret i rapport-modulet.',      now() - interval '4 days',  now() - interval '4 days'),
  ('Frederik Møller',  'Møller Industri',     'frederik@mollerindustri.dk', 320000, 'tilbud_sendt', 'Vil have tilbud med både årlig og månedlig betaling. Sendt 9/6.',     now() - interval '8 days',  now() - interval '8 days'),
  ('Ida Nielsen',      'Nielsen Group',       'ida@nielsengroup.dk',        510000, 'aktiv',        'Største kunde. Kvartalsvis check-in aftalt. Reference muligt.',       now() - interval '52 days', now() - interval '52 days'),
  ('Thomas Bach',      'Bach Software',       'thomas@bachsoftware.dk',      75000, 'tabt',         'Valgte en konkurrent pga. pris. Genovervej om 6 måneder.',            now() - interval '40 days', now() - interval '40 days'),
  ('Louise Friis',     'Friis Rådgivning',    'louise@friisraadgivning.dk',  40000, 'lead',         'Anbefalet af Camilla (BergTech). Varm lead.',                         now() - interval '3 days',  now() - interval '3 days'),
  ('Rasmus Toft',      'Toft Energi',         'rasmus@toftenergi.dk',       600000, 'kontrakt',     'Stor aftale. Afventer godkendelse af budget. Tæt på lukning.',        now() - interval '23 days', now() - interval '23 days');
