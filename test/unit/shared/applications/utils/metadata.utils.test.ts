import MetadataUtils from '@src/shared/applications/utils/metadata.utils';

describe('MetadataUtils', () => {
  let metadataUtils: MetadataUtils;

  beforeEach(() => {
    metadataUtils = new MetadataUtils();
  });

  describe('getDadosPaginacao', () => {
    it('should build pagination metadata when previous and next pages exist', () => {
      expect(metadataUtils.getDadosPaginacao(50, 10, 10, 3, '/jobs')).toEqual({
        totalItems: 50,
        itemCount: 10,
        itemsPerPage: 10,
        totalPages: 5,
        currentPage: 3,
        hasNextPage: true,
        hasPreviousPage: true,
        links: {
          first: '/jobs?limit=10',
          previous: '/jobs?page=2&limit=10',
          next: '/jobs?page=4&limit=10',
          last: '/jobs?page=5&limit=10',
        },
      });
    });

    it('should build pagination metadata for the first and last page boundaries', () => {
      expect(metadataUtils.getDadosPaginacao(10, 10, 10, 1, '/jobs')).toEqual({
        totalItems: 10,
        itemCount: 10,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        links: {
          first: '/jobs?limit=10',
          previous: '',
          next: '',
          last: '/jobs?page=1&limit=10',
        },
      });
    });
  });
});
