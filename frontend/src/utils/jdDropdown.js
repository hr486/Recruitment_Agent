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

const formatCreatedDate = (rawValue) => {
  if (!rawValue) return 'N/A';
  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) {
    return rawValue.toString().slice(0, 10);
  }
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const shorten = (value, maxLength = 26) => {
  if (!value || value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3)}...`;
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
