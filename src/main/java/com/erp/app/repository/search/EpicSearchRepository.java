package com.erp.app.repository.search;

import com.erp.app.domain.Epic;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Epic entity.
 */
public interface EpicSearchRepository extends ElasticsearchRepository<Epic, String> {
}
