package com.erp.app.repository.search.custom;

import com.erp.app.domain.custom.BoardCustom;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Epic entity.
 */

public interface BoardCustomSearchRepository extends  ElasticsearchRepository<BoardCustom, String> {
}
