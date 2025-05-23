import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import { get, handleError } from 'data/fetchers'
import type { AuditLog } from 'data/organizations/organization-audit-logs-query'
import { IS_PLATFORM } from 'lib/constants'
import type { ResponseError } from 'types'
import { profileKeys } from './keys'

export type ProfileAuditLogsVariables = {
  iso_timestamp_start: string
  iso_timestamp_end: string
}

export async function getProfileAuditLogs(
  { iso_timestamp_start, iso_timestamp_end }: ProfileAuditLogsVariables,
  signal?: AbortSignal
) {
  const { data, error } = await get('/platform/profile/audit', {
    params: {
      query: {
        iso_timestamp_start,
        iso_timestamp_end,
      },
    },
    signal,
  })

  if (error) handleError(error)
  return data as unknown as ProfileAuditLogsData
}

export type ProfileAuditLogsError = ResponseError
export type ProfileAuditLogsData = {
  result: AuditLog[]
  retention_period: number
}

export const useProfileAuditLogsQuery = <TData = ProfileAuditLogsData>(
  vars: ProfileAuditLogsVariables,
  options: UseQueryOptions<ProfileAuditLogsData, ProfileAuditLogsError, TData> = {}
) => {
  const { iso_timestamp_start, iso_timestamp_end } = vars
  return useQuery<ProfileAuditLogsData, ProfileAuditLogsError, TData>(
    profileKeys.auditLogs({ date_start: iso_timestamp_start, date_end: iso_timestamp_end }),
    ({ signal }) => getProfileAuditLogs(vars, signal),
    {
      enabled: IS_PLATFORM && options.enabled,
      ...options,
    }
  )
}
