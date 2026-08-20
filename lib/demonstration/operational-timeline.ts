export const OPERATIONAL_TIMELINE = [
  ["SYSTEM", "00:02", "Configured action level reached", "The configured operational trigger was reached at Work Zone A."],
  ["SYSTEM", "00:02", "Alert created", "The operational event entered the Incident Centre."],
  ["SYSTEM", "00:02", "Notifications sent", "Notifications sent to configured recipients."],
  ["USER", "00:03", "Acknowledged by Site Manager", "The event was received for operational response."],
  ["USER", "00:04", "Assigned to Site Supervisor", "Operational ownership was recorded."],
  ["USER", "00:05", "Investigation started", "The site response review began."],
  ["USER", "00:07", "Action recorded", "Temporary dust control reviewed and work area inspected."],
  ["SYSTEM", "00:08+", "Monitoring continued", "Subsequent observations remained connected to the event."],
  ["USER", "00:10", "Operational review", "Event history, observations and response were reviewed."],
  ["USER", "00:12", "Event resolved", "The VerifAir operational event was closed after review."]
] as const;

export type OperationalTimelineEntry = (typeof OPERATIONAL_TIMELINE)[number];
