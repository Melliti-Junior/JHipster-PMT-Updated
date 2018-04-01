package com.erp.app.repository.search;

import com.erp.app.domain.Board;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Board entity.
 */
public interface BoardSearchRepository extends ElasticsearchRepository<Board, String> {
}
