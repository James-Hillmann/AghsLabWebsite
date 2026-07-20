-- The codes collected before this page existed, checked character by character against the
-- spreadsheet. Run once after schema.sql. `do nothing` on conflict, so re-running is
-- harmless and this can never clobber a code that's since been corrected in the app.
--
-- These mix glyphs that look alike in most UI faces -- capital I against lowercase l, O
-- against zero -- and one wrong character means the code just fails in game. Slots 7 and 9
-- of initial-guidance both end in a lowercase l, not a capital I. That's why the page
-- renders codes in a monospace face, and why every slot stays editable: a bad character is
-- a two-click fix rather than a redeploy.

insert into guidance_codes (tome_slug, slot, code, added_by) values
  ('initial-guidance',  1, 'first_start9rN9KZ75', 'james'),
  ('initial-guidance',  2, 'first_startziaLdBLv', 'james'),
  ('initial-guidance',  3, 'first_startkWiYkFMn', 'james'),
  ('initial-guidance',  4, 'first_startWZcCLzJn', 'james'),
  ('initial-guidance',  5, 'first_startjRtQhlul', 'james'),
  ('initial-guidance',  6, 'first_starttRRJ5B9b', 'james'),
  ('initial-guidance',  7, 'first_startptI9l7hk', 'james'),
  ('initial-guidance',  8, 'first_startWhWUC959', 'james'),
  ('initial-guidance',  9, 'first_start98gyfPHl', 'james'),
  ('initial-guidance', 10, 'first_start7CcZxP1m', 'james'),
  ('initial-guidance', 11, 'first_startv8sLkued', 'james'),
  ('initial-guidance', 12, 'first_startPZCgvBvF', 'james'),
  ('initial-guidance', 13, 'first_startOEcC1Kkf', 'james'),
  ('initial-guidance', 14, 'first_startagGqUCPj', 'james'),
  ('initial-guidance', 15, 'first_startLJDiGjRi', 'james'),
  ('initial-guidance', 16, 'first_startz8o9Q0th', 'james'),
  ('initial-guidance', 17, 'first_startPWS0vzON', 'james'),
  ('initial-guidance', 18, 'first_startvBNNswYP', 'james'),
  ('initial-guidance', 19, 'first_startc8xP7LZH', 'james'),
  ('initial-guidance', 20, 'first_startptt1vOQr', 'james'),

  ('tome-of-the-fallen',  1, 'daemonomiconoH0ThDOr', 'james'),
  ('tome-of-the-fallen',  3, 'daemonomicon9hieSDyZ', 'james'),
  ('tome-of-the-fallen',  5, 'daemonomicon5VbKgv5C', 'james'),
  ('tome-of-the-fallen',  6, 'daemonomiconb1auDSy9', 'james'),
  ('tome-of-the-fallen',  7, 'daemonomicontT7QAcuy', 'james'),
  ('tome-of-the-fallen',  9, 'daemonomiconet9Kvm9a', 'james'),
  ('tome-of-the-fallen', 12, 'daemonomiconBBrMbHu7', 'james'),
  ('tome-of-the-fallen', 14, 'daemonomiconGjujMPLi', 'james'),
  ('tome-of-the-fallen', 15, 'daemonomiconsezykkCR', 'james')
on conflict (tome_slug, slot) do nothing;
