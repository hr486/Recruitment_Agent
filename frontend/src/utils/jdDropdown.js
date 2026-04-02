const getSafeText = (value, fallback = 'N/A') => {
  const text = (value ?? '').toString().trim();
  return text || fallback;
};

const getCreatedRaw = (jd) => {
  return (
    jd?.created_at ||
    jd?.createdAt ||
    jd?.created_on ||
    jd?.createdOn ||
    jd?.Created_At ||
    jd?.CreatedAt ||
    ''
  );
};

const parseCreatedTimestamp = (rawValue) => {
  if (!rawValue) return null;
  const text = rawValue.toString().trim();

  const isoParsed = new Date(text);
  if (!Number.isNaN(isoParsed.getTime())) return isoParsed;

  const ddmmyyyyMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:[\sT](\d{2}):(\d{2}):(\d{2}))?$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year, hour = '00', minute = '00', second = '00'] = ddmmyyyyMatch;
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)));
  }

  return null;
};

const formatCreatedDate = (rawValue) => {
  const parsed = parseCreatedTimestamp(rawValue);
  if (!parsed) return 'N/A';
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatCreatedTimestamp = (rawValue) => {
  const parsed = parseCreatedTimestamp(rawValue);
  if (!parsed) return rawValue ? rawValue.toString() : 'N/A';
  return parsed.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const shorten = (value, maxLength = 26) => {
  if (!value || value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3)}...`;
};

const getCreatedSortValue = (jd) => {
  const rawValue = getCreatedRaw(jd);
  const parsed = parseCreatedTimestamp(rawValue);
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed.getTime() : 0;
};

export const buildJdDropdownOption = (jd, config = {}) => {
  const { maxRoleLength = 26 } = config;
  const id = getSafeText(jd?.jd_id || jd?.JD_ID || jd?.id, 'N/A');
  const roleFull = getSafeText(jd?.title || jd?.role || jd?.job_title, 'Untitled Role');
  const createdText = formatCreatedDate(getCreatedRaw(jd));
  const roleShort = shorten(roleFull, maxRoleLength);

  return {
    value: jd?.jd_id || jd?.JD_ID || '',
    label: `${roleShort} | ${id} | ${createdText}`,
    fullLabel: `Role: ${roleFull} | JD ID: ${id} | Created: ${createdText}`
  };
};

export const sortJdsNewestFirst = (jds = []) => {
  return [...jds].sort((left, right) => {
    const rightCreated = getCreatedSortValue(right);
    const leftCreated = getCreatedSortValue(left);
    if (rightCreated !== leftCreated) return rightCreated - leftCreated;

    const rightId = (right?.jd_id || right?.JD_ID || '').toString();
    const leftId = (left?.jd_id || left?.JD_ID || '').toString();
    return rightId.localeCompare(leftId);
  });
};
