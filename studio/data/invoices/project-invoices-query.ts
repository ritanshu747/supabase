import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { get } from 'data/fetchers'
import { ResponseError } from 'types'
import { invoicesKeys } from './keys'

export type ProjectInvoicesVariables = {
  projectRef?: string
  offset: number
  limit: number
}

export async function getProjectInvoices(
  { projectRef, offset, limit }: ProjectInvoicesVariables,
  signal?: AbortSignal
) {
  if (!projectRef) throw new Error('Project ref is required')

  const { data, error } = await get(`/platform/projects/{ref}/invoices`, {
    params: {
      path: { ref: projectRef },
      query: { offset: offset.toString(), limit: limit.toString() },
    },
    signal,
  })

  if (error) throw error
  return data
}

export type ProjectInvoicesData = Awaited<ReturnType<typeof getProjectInvoices>>
export type ProjectInvoicesError = ResponseError

export const useProjectInvoicesQuery = <TData = ProjectInvoicesData>(
  { projectRef, offset, limit }: ProjectInvoicesVariables,
  {
    enabled = true,
    ...options
  }: UseQueryOptions<ProjectInvoicesData, ProjectInvoicesError, TData> = {}
) =>
  useQuery<ProjectInvoicesData, ProjectInvoicesError, TData>(
    invoicesKeys.projectInvoices(projectRef),
    ({ signal }) => getProjectInvoices({ projectRef, offset, limit }, signal),
    {
      enabled:
        enabled &&
        typeof projectRef !== 'undefined' &&
        typeof limit !== 'undefined' &&
        typeof offset !== 'undefined',
      ...options,
    }
  )
