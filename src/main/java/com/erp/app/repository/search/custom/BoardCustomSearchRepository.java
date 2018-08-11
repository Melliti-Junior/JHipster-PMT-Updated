package com.erp.app.repository.search.custom;

import com.erp.app.domain.custom.CustomBoard;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Epic entity.
 */

public interface BoardCustomSearchRepository extends  ElasticsearchRepository<CustomBoard, String> {
}
