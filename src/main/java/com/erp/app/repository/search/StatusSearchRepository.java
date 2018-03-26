package com.erp.app.repository.search;

import com.erp.app.domain.Status;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Status entity.
 */
public interface StatusSearchRepository extends ElasticsearchRepository<Status, String> {
}
